'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // 記錄錯誤到控制台
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <AlertTriangle className="h-24 w-24 mx-auto text-red-500 mb-4" />
          <h1 className="text-6xl font-bold text-gray-900 mb-4">錯誤</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">建構中</h2>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            系統正在建構中，請稍後再試。
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex gap-4 justify-center">
            <Button onClick={reset} size="lg" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              重試
            </Button>
            
            <Button asChild size="lg">
              <Link href="/" className="inline-flex items-center gap-2">
                <Home className="h-4 w-4" />
                返回首頁
              </Link>
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>TissueCryoEM core預約系統</p>
          </div>
        </div>
      </div>
    </div>
  )
}
