'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getSession } from 'next-auth/react'
import Link from 'next/link'

export default function SignUpPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [usernameError, setUsernameError] = useState('')
  const [checkingUsername, setCheckingUsername] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    getSession().then((session) => {
      if (session) {
        router.push('/')
      }
    })
  }, [router])

  // Username validation and duplication check
  useEffect(() => {
    const checkUsername = async () => {
      if (username.length < 3) {
        setUsernameError(username.length > 0 ? 'ID는 3자 이상이어야합니다!' : '')
        return
      }

      setCheckingUsername(true)
      try {
        const response = await fetch(`/api/auth/check-username/${encodeURIComponent(username)}`)
        const data = await response.json()
        
        if (!data.available) {
          setUsernameError('이미 있어요... :(')
        } else {
          setUsernameError('')
        }
      } catch (error) {
        console.error('Error checking username:', error)
      } finally {
        setCheckingUsername(false)
      }
    }

    const timeoutId = setTimeout(checkUsername, 500) // Debounce for 500ms
    return () => clearTimeout(timeoutId)
  }, [username])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (username.length < 3) {
      setError('ID는 3자 이상이어야합니다!')
      return
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야합니다!')
      return
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 달라요오...')
      return
    }

    if (usernameError) {
      setError('Please fix the username error')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Redirect to sign in page with success message
        router.push('/auth/signin?message=Account created successfully')
      } else {
        setError(data.error || 'Failed to create account')
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center">
          <h1 className="text-3xl font-bold text-gray-900">Bloodline</h1>
        </Link>
        <h2 className="mt-6 text-center text-2xl font-medium text-gray-900">
          회원 가입을 환영합니다 :)
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                ID
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className={`appearance-none block w-full px-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 ${
                    usernameError ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="ID (3+ characters)"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
                {checkingUsername && (
                  <p className="mt-1 text-xs text-gray-500">Checking availability...</p>
                )}
                {usernameError && (
                  <p className="mt-1 text-xs text-red-600">{usernameError}</p>
                )}
                {username.length >= 3 && !usernameError && !checkingUsername && (
                  <p className="mt-1 text-xs text-green-600">Username available ✓</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  placeholder="Password (6+ characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
                  placeholder=""
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading || usernameError !== '' || checkingUsername}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-400"
              >
                {isLoading ? '회원 가입 중...' : '회원 가입!'}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                이미 회원이신가요?{' '}
                <Link href="/auth/signin" className="font-medium text-gray-900 hover:text-gray-700">
                  로그인하기!
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}