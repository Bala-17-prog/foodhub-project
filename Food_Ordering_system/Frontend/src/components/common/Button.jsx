const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  icon,
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2 border-0';
  
  const variants = {
    primary: 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 focus:ring-orange-500 shadow-lg hover:shadow-xl transform hover:scale-105',
    secondary: 'bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 focus:ring-gray-500 shadow-lg hover:shadow-xl transform hover:scale-105',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-lg hover:shadow-xl transform hover:scale-105',
    success: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-500 shadow-lg hover:shadow-xl transform hover:scale-105',
    outline: 'border-2 border-orange-600 text-orange-600 bg-white hover:bg-gradient-to-r hover:from-orange-600 hover:to-red-600 hover:text-white hover:border-transparent focus:ring-orange-500 shadow-md hover:shadow-lg transform hover:scale-105',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500 hover:shadow-md',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm min-h-[32px]',
    md: 'px-4 py-2 text-base min-h-[40px]',
    lg: 'px-6 py-3 text-lg min-h-[48px]',
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const disabledClass = (disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant] || variants.primary} ${sizes[size]} ${widthClass} ${disabledClass} ${className}`}
      style={{ 
        WebkitAppearance: 'none',
        MozAppearance: 'none',
        appearance: 'none'
      }}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
