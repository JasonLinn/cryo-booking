import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-600 mb-4" />
        <h2 className="text-xl font-semibold text-gray-800 mb-2">載入中...</h2>
        <p className="text-gray-600">系統建構中，請稍候</p>
      </div>
    </div>
  )
}
