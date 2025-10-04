import PPSULogo from '../assets/PPSUNAACA+Logo.png';

const PPSUBranding = ({ size = 'medium', showText = true, showNAAC = false, className = '' }) => {

  const sizeClasses = {
    small: 'h-6 w-6 sm:h-8 sm:w-8',
    medium: 'h-8 w-8 sm:h-10 sm:w-10',
    large: 'h-12 w-12 sm:h-16 sm:w-16',
    xlarge: 'h-16 w-16 sm:h-20 sm:w-20'
  };

  const textSizes = {
    small: 'text-xs sm:text-sm',
    medium: 'text-sm sm:text-lg',
    large: 'text-lg sm:text-2xl',
    xlarge: 'text-xl sm:text-3xl'
  };

  return (
    <div className={`flex items-center space-x-2 sm:space-x-3 ${className}`}>
      <div className="relative">
        <img 
          src={PPSULogo} 
          alt="PPSU NAAC A+ Logo" 
          className={`${sizeClasses[size]} object-contain`}
        />
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-slate-900 ${textSizes[size]}`}>
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
