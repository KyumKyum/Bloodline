import { Header } from '@/components/Header'
import { MysteryGrid } from '@/components/MysteryGrid'

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            (주인장이 해본 것만 올리는) 머더 미스터리 아카이브   
          </h1>
          <p className="text-gray-600 text-lg">
            제가 해본 것 중 흥미로운 머더 미스터리만 올리고 아카이빙합니다!<br/>여러분들도 난이도와 평점을 평가해주세요~ :)
          </p>
        </div>

        <MysteryGrid />
      </main>
    </div>
  )
}
