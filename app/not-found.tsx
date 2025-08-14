import Link from 'next/link'
import { Construction, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <Construction className="h-24 w-24 mx-auto text-orange-500 mb-4" />
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">建構中</h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            此頁面正在建構中，請稍後再試或返回首頁。
          </p>
        </div>
        
        <div className="space-y-4">
          <Button asChild size="lg">
            <Link href="/" className="inline-flex items-center gap-2">
              <Home className="h-4 w-4" />
              返回首頁
            </Link>
          </Button>
          
          <div className="text-sm text-gray-500">
            <p>低溫設備預約系統</p>
          </div>
        </div>
      </div>
    </div>
  )
}
