'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { LogIn, LogOut, User } from 'lucide-react'

export function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900 hover:text-gray-700">
          Bloodline
        </Link>
        
        <nav className="flex items-center space-x-4">
          {status === 'loading' ? (
            <div className="w-8 h-8 animate-pulse bg-gray-200 rounded-full" />
          ) : session ? (
            <div className="flex items-center space-x-4">
              <Link
                href="/profile"
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-2 py-1 rounded-md transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="text-sm">{session.user.username}</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>로그 아웃</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                href="/auth/signin"
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>로그인</span>
              </Link>
              <Link
                href="/auth/signup"
                className="px-3 py-2 text-sm bg-gray-900 text-white hover:bg-gray-800 rounded-md transition-colors"
              >
                가입하기!
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}