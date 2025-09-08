import React from 'react';
// Import your logo image
import logoImage from '@/assets/images/logo.jpeg';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizeClasses = {
    sm: 'w-20 h-16',
    md: 'w-14 h-14',
    lg: 'w-20 h-20'
  };

  const textSizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  return (
    <div className={`flex items-center ${showText ? 'flex-col' : 'flex-row'} ${className}`}>
      {/* Logo Image - No Container */}
      <img
        src={logoImage}
        alt="Zeina Real Estate Logo"
        className={`${sizeClasses[size]} object-contain`}
      />
      
      {/* Company Name - only show if showText is true */}
      {showText && (
        <div className="text-center mt-1">
          <div className={`text-logo font-semibold ${textSizeClasses[size]}`}>zeina</div>
          <div className="text-muted-foreground text-xs">for real estate</div>
        </div>
      )}
    </div>
  );
};

export default Logo;
