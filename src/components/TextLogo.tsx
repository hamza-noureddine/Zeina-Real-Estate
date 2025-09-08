import React from 'react';

interface TextLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

const TextLogo: React.FC<TextLogoProps> = ({ className = '', size = 'md', showSubtitle = true }) => {
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  };

  const subtitleSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Main Logo Text */}
      <div className={`${sizeClasses[size]} font-bold text-logo tracking-wide`}>
        zeina
      </div>
      
      {/* Subtitle */}
      {showSubtitle && (
        <div className={`${subtitleSizeClasses[size]} text-muted-foreground font-medium tracking-wider`}>
          for real estate
        </div>
      )}
    </div>
  );
};

export default TextLogo;
