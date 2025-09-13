import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  User, 
  Calendar, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Edit3, 
  Settings, 
  MoreHorizontal,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Users,
  Award,
  Star,
  Camera,
  Plus
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { userApi } from '../services/userApi.js';
import { postApi } from '../services/postApi.js';
import toast from 'react-hot-toast';

const Profile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('posts');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Mock user data - replace with actual API calls
  const mockUser = {
    id: userId || '1',
    name: 'Dr. Rajesh Kumar',
    email: 'rajesh.kumar@ppsu.ac.in',
    role: 'Professor',
    department: 'Computer Science',
    year: 'Faculty',
    studentId: null,
    phone: '+91 98765 43210',
    location: 'Surat, Gujarat',
    website: 'https://rajeshkumar.ppsu.ac.in',
    bio: 'Professor of Computer Science with expertise in Artificial Intelligence and Machine Learning. Passionate about teaching and research. Always excited to help students learn and grow.',
    avatar: null,
    coverUrl: null,
    isVerified: true,
    isFollowing: false,
    followersCount: 1250,
    followingCount: 89,
    postsCount: 45,
    joinedDate: new Date('2020-01-15'),
    socialLinks: {
      twitter: 'https://twitter.com/rajeshkumar',
      linkedin: 'https://linkedin.com/in/rajeshkumar',
      github: 'https://github.com/rajeshkumar'
    },
    achievements: [
      { title: 'Best Teacher Award 2023', icon: '🏆' },
      { title: 'Research Excellence', icon: '🔬' },
      { title: 'Student Mentor', icon: '👨‍🏫' }
    ],
    interests: ['Artificial Intelligence', 'Machine Learning', 'Data Science', 'Research', 'Teaching']
  };

  const mockPosts = [
    {
      id: '1',
      content: 'Excited to announce the upcoming PPSU Tech Symposium 2024! This year we have amazing speakers from top tech companies.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      likesCount: 45,
      commentsCount: 12,
      sharesCount: 8,
      media: [{
        type: 'image',
        url: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop'
      }],
      hashtags: ['#PPSUFest2024', '#Technology']
    },
    {
      id: '2',
      content: 'Just finished reviewing some amazing research papers from our students. The quality of work is truly impressive!',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      likesCount: 23,
      commentsCount: 8,
      sharesCount: 3,
      media: [],
      hashtags: ['#Research', '#Students']
    }
  ];

  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        // Load user profile
        const userResponse = await userApi.getUser(userId);
        setUser(userResponse.user);
        
        // Load user posts
        const postsResponse = await userApi.getUserPosts(userId, 1, 10);
        setPosts(postsResponse.posts || []);
      } catch (error) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
        setUser(null);
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await userApi.unfollowUser(userId);
        toast.success('Unfollowed user');
      } else {
        await userApi.followUser(userId);
        toast.success('Following user');
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error toggling follow:', error);
      toast.error('Failed to update follow status');
    }
  };

  const handleMessage = () => {
    // TODO: Implement messaging functionality
    console.log('Message user:', user.id);
  };

  const handleShare = () => {
    // TODO: Implement share profile functionality
    console.log('Share profile:', user.id);
  };

  const formatJoinDate = (date) => {
    return `Joined ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">User not found</h2>
          <p className="text-slate-600">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="card-modern mb-6 overflow-hidden">
          {/* Cover Photo */}
          <div className="h-48 bg-gradient-to-r from-primary-500 to-accent-500 relative">
            {user.coverUrl ? (
              <img 
                src={user.coverUrl} 
                alt="Cover" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-primary-500 to-accent-500"></div>
            )}
            <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-colors">
              <Camera className="h-5 w-5" />
            </button>
          </div>

          {/* Profile Info */}
          <div className="p-6 -mt-16 relative">
            <div className="flex items-start justify-between">
              <div className="flex items-end space-x-4">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold text-4xl border-4 border-white shadow-large">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <button className="absolute bottom-2 right-2 p-2 bg-white text-slate-600 rounded-full shadow-medium hover:bg-slate-50 transition-colors">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                {/* User Details */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                    {user.isVerified && (
                      <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    )}
                  </div>
                  <p className="text-lg text-slate-600 mb-1">{user.role} • {user.department}</p>
                  <p className="text-slate-500 mb-3">{formatJoinDate(user.joinedDate)}</p>
                  
                  {/* Bio */}
                  <p className="text-slate-700 leading-relaxed max-w-2xl">{user.bio}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={handleMessage}
                  className="btn-secondary px-4 py-2 flex items-center space-x-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Message</span>
                </button>
                <button
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                    isFollowing
                      ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      : 'btn-primary'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <Share2 className="h-5 w-5" />
                </button>
                <button className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors">
                  <MoreHorizontal className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{user.postsCount}</div>
                <div className="text-sm text-slate-500">Posts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{user.followersCount}</div>
                <div className="text-sm text-slate-500">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-slate-900">{user.followingCount}</div>
                <div className="text-sm text-slate-500">Following</div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* About */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <div className="card-modern p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-slate-400" />
                  <span className="text-slate-700">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-700">{user.phone}</span>
                  </div>
                )}
                {user.location && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-700">{user.location}</span>
                  </div>
                )}
                {user.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-slate-400" />
                    <a href={user.website} className="text-primary-600 hover:text-primary-700">
                      {user.website}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Achievements */}
            <div className="card-modern p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Achievements</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {user.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
                    <span className="text-2xl">{achievement.icon}</span>
                    <span className="text-sm font-medium text-slate-700">{achievement.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="card-modern p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Interests</h3>
              <div className="flex flex-wrap gap-2">
                {user.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Social Links */}
            <div className="card-modern p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Social Links</h3>
              <div className="space-y-3">
                {Object.entries(user.socialLinks).map(([platform, url]) => (
                  <a
                    key={platform}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-2 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    <Globe className="h-5 w-5 text-slate-400" />
                    <span className="text-slate-700 capitalize">{platform}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card-modern p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full btn-secondary justify-start">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Send Message
                </button>
                <button className="w-full btn-outline justify-start">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Profile
                </button>
                <button className="w-full btn-outline justify-start">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Save Contact
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="card-modern">
          {/* Tabs */}
          <div className="border-b border-slate-200">
            <nav className="flex space-x-8">
              {['posts', 'media', 'likes'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Posts Content */}
          <div className="p-6">
            {activeTab === 'posts' && (
              <div className="space-y-6">
                {posts.map((post) => (
                  <div key={post.id} className="border border-slate-200 rounded-xl p-6 hover:shadow-soft transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900">{user.name}</h4>
                          <p className="text-sm text-slate-500">{formatDistanceToNow(post.createdAt)} ago</p>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-700 mb-4">{post.content}</p>
                    
                    {post.media.length > 0 && (
                      <div className="mb-4">
                        <img 
                          src={post.media[0].url} 
                          alt="Post content" 
                          className="w-full h-48 object-cover rounded-xl"
                        />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <Heart className="h-4 w-4" />
                          <span>{post.likesCount}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.commentsCount}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Share2 className="h-4 w-4" />
                          <span>{post.sharesCount}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {activeTab === 'media' && (
              <div className="text-center py-12 text-slate-500">
                <Camera className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>No media posts yet</p>
              </div>
            )}
            
            {activeTab === 'likes' && (
              <div className="text-center py-12 text-slate-500">
                <Heart className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p>No liked posts yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;