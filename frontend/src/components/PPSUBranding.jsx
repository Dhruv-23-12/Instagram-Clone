import { useState } from 'react';

const PPSUBranding = ({ size = 'medium', showText = true, showNAAC = false, className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: 'h-6 w-6',
    medium: 'h-10 w-10',
    large: 'h-16 w-16',
    xlarge: 'h-20 w-20'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-2xl',
    xlarge: 'text-3xl'
  };

  return (
    <div 
      className={`flex items-center space-x-3 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img 
          src="/assets/ppsu-logo.svg" 
          alt="PPSU Logo" 
          className={`${sizeClasses[size]} transition-all duration-300 ${isHovered ? 'scale-110 drop-shadow-glow' : 'scale-100'}`}
        />
        {isHovered && (
          <div className="absolute -top-2 -right-2 bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs px-2 py-1 rounded-full font-bold animate-bounce shadow-glow-red">
            A+
          </div>
        )}
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-slate-900 ${textSizes[size]} ${isHovered ? 'gradient-text' : ''}`}>
            PPSU Social
          </span>
          <span className={`text-slate-600 ${size === 'small' ? 'text-xs' : 'text-sm'} font-medium`}>
            P P Savani University
          </span>
          {showNAAC && (
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-xs text-slate-400 font-medium">NAAC</span>
              <span className="text-xs text-slate-500 font-medium">ACCREDITED</span>
              <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs px-2 py-1 rounded-full font-bold shadow-glow-red">
                A+ GRADE
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PPSUBranding;
