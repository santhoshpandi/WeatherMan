export const ErrorState = ({ message }: { message: string }) => {
  return (
    <div className="bg-white border border-red-100 rounded-2xl p-4 sm:p-6 text-center shadow">
      <p className="text-red-500 font-medium mb-1">
        ⚠️ Something went wrong
      </p>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  )
}