export const SkeletonCard = () => {
  return (
    <div
      className="
        bg-white 
        rounded-2xl 
        shadow-md 
        border border-blue-100
        p-4 sm:p-5 
        animate-pulse
      "
    >
      <div className="h-5 w-20 bg-blue-100 rounded mb-3"></div>
      <div className="h-8 w-16 bg-blue-200 rounded mb-3"></div>
      <div className="h-4 w-24 bg-blue-100 rounded"></div>
    </div>
  )
}