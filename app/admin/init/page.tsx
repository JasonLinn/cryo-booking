'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminInitPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleInit = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/init')
      const data = await response.json()
      
      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || '初始化失敗')
      }
    } catch (err) {
      setError('網路錯誤：' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const checkEquipment = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/equipment')
      const data = await response.json()
      
      if (response.ok) {
        setResult({ message: '設備列表載入成功', equipment: data })
      } else {
        setError(data.error || '載入設備失敗')
      }
    } catch (err) {
      setError('網路錯誤：' + (err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>資料庫初始化工具</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600">
            如果這是首次部署到 Vercel，請先初始化資料庫。
          </p>

          <div className="flex gap-4">
            <Button 
              onClick={handleInit} 
              disabled={loading}
              className="flex-1"
            >
              {loading ? '初始化中...' : '初始化資料庫'}
            </Button>
            
            <Button 
              onClick={checkEquipment} 
              disabled={loading}
              variant="outline"
              className="flex-1"
            >
              {loading ? '檢查中...' : '檢查設備列表'}
            </Button>
          </div>

          {result && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <h3 className="font-medium text-green-800 mb-2">成功</h3>
                <pre className="text-sm text-green-700 overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-4">
                <h3 className="font-medium text-red-800 mb-2">錯誤</h3>
                <p className="text-sm text-red-700">{error}</p>
              </CardContent>
            </Card>
          )}

          <div className="text-xs text-gray-500 space-y-2">
            <p><strong>說明：</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>首次部署時需要點擊「初始化資料庫」</li>
              <li>初始化會建立範例設備和時間段</li>
              <li>點擊「檢查設備列表」可驗證資料庫是否正常</li>
              <li>如果遇到錯誤，可以重新初始化</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
