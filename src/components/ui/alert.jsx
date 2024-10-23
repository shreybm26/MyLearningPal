import * as React from "react"

const Alert = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    destructive: "bg-red-100 text-red-800"
  }

  return (
    <div
      ref={ref}
      role="alert"
      className={`rounded-lg p-4 ${variantClasses[variant]} ${className}`}
      {...props}
    />
  )
})
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-sm [&_p]:leading-relaxed ${className}`}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription }