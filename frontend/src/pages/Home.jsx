import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Users, Heart, MessageCircle, ArrowRight } from 'lucide-react';
import PPSUBranding from '../components/PPSUBranding.jsx';

const Home = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-24 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 via-transparent to-accent-100/50"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-200/30 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="flex justify-center mb-8 animate-fade-in">
            <PPSUBranding 
              size="xlarge" 
              showText={true} 
              showNAAC={true}
              className="text-center"
            />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-6 animate-slide-up">
            Welcome to <span className="gradient-text">PPSU Social</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-4xl mx-auto leading-relaxed animate-slide-up">
            Connect with students, teachers, and staff at P P Savani University. 
            Share moments, build connections, and stay updated with campus life.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-slide-up">
            {isAuthenticated ? (
              <Link to="/feed" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
                Go to Feed
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
                  Join PPSU Social
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/login" className="btn-outline text-lg px-8 py-4 inline-flex items-center">
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 section-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Why Choose <span className="gradient-text">PPSU Social</span>?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              A secure, exclusive platform designed specifically for the PPSU community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-modern text-center card-hover group">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-primary-100 rounded-2xl group-hover:bg-primary-200 transition-colors duration-300">
                  <Users className="h-12 w-12 text-primary-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Exclusive Community
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Only PPSU students, teachers, and staff can join. Connect with your campus community in a safe, verified environment.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-modern text-center card-hover group">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-accent-100 rounded-2xl group-hover:bg-accent-200 transition-colors duration-300">
                  <Heart className="h-12 w-12 text-accent-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Share & Connect
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Share photos, stories, and moments. Like posts, comment, and follow friends to stay connected with campus life.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-modern text-center card-hover group">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-success-100 rounded-2xl group-hover:bg-success-200 transition-colors duration-300">
                  <MessageCircle className="h-12 w-12 text-success-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Real-time Updates
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Stay updated with campus events, announcements, and activities. Follow your interests and discover new connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-24 bg-gradient-to-r from-primary-600 via-primary-700 to-accent-600 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 via-transparent to-accent-500/20"></div>
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Ready to Join the <span className="text-yellow-300">PPSU Community</span>?
            </h2>
            <p className="text-xl md:text-2xl text-primary-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Sign up today and start connecting with your campus family
            </p>
            <Link to="/signup" className="bg-white text-primary-600 hover:bg-slate-50 font-bold px-10 py-4 rounded-2xl shadow-large hover:shadow-glow transition-all duration-300 hover:scale-105 text-lg inline-flex items-center">
              Get Started Now
              <ArrowRight className="ml-2 h-6 w-6" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
