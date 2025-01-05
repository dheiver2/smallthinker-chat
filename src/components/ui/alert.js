// src/components/ui/Alert.jsx
const Alert = ({ variant = "default", children, className, ...props }) => {
  const baseStyle = "relative w-full rounded-lg border p-4";
  const variants = {
    default: "bg-white border-gray-200 text-gray-900",
    destructive: "bg-red-50 border-red-500 text-red-900",
  };

  return (
    <div
      role="alert"
      className={`${baseStyle} ${variants[variant]} ${className || ''}`}
      {...props}
    >
      {children}
    </div>
  );
};

const AlertDescription = ({ children, className, ...props }) => (
  <div
    className={`text-sm ${className || ''}`}
    {...props}
  >
    {children}
  </div>
);

export { Alert, AlertDescription };
