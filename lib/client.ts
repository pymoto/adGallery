import { createBrowserClient as createSupabaseBrowserClient } from "@supabase/ssr"
import { getSupabaseConfig } from "./env-config"

// モックユーザーストレージ（ローカルストレージを使用）
const getMockUsers = (): Map<string, { email: string; password: string; id: string; created_at: string }> => {
  if (typeof window === 'undefined') return new Map()
  
  try {
    const stored = localStorage.getItem('mockUsers')
    if (stored) {
      const users = JSON.parse(stored)
      return new Map(Object.entries(users))
    }
  } catch (error) {
    console.error('Error loading mock users from localStorage:', error)
  }
  return new Map()
}

const saveMockUsers = (users: Map<string, { email: string; password: string; id: string; created_at: string }>) => {
  if (typeof window === 'undefined') return
  
  try {
    const usersObj = Object.fromEntries(users)
    localStorage.setItem('mockUsers', JSON.stringify(usersObj))
  } catch (error) {
    console.error('Error saving mock users to localStorage:', error)
  }
}

const getCurrentUser = (): any => {
  if (typeof window === 'undefined') return null
  
  try {
    const stored = localStorage.getItem('currentUser')
    return stored ? JSON.parse(stored) : null
  } catch (error) {
    console.error('Error loading current user from localStorage:', error)
    return null
  }
}

const setCurrentUser = (user: any) => {
  if (typeof window === 'undefined') return
  
  try {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('currentUser')
    }
  } catch (error) {
    console.error('Error saving current user to localStorage:', error)
  }
}

let mockUsers = getMockUsers()
let currentUser = getCurrentUser()

export function createBrowserClient() {
  // 環境別設定から取得
  const { url: supabaseUrl, anonKey: supabaseAnonKey } = getSupabaseConfig()
  
  // 環境変数の確認（初回のみ）
  if (process.env.NODE_ENV === 'development' && !(globalThis as any).supabaseEnvChecked) {
    console.log("Environment check:", {
      url: supabaseUrl,
      key: supabaseAnonKey ? "***configured***" : "not configured"
    })
    ;(globalThis as any).supabaseEnvChecked = true
  }
  
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase environment variables are not configured. Please check your .env.local file.")
  }
  
  const client = createSupabaseBrowserClient(supabaseUrl, supabaseAnonKey)
  
  // ステージング環境でのリダイレクトURLを動的に設定
  if (typeof window !== 'undefined') {
    const currentUrl = window.location.origin
    if (currentUrl.includes('vercel.app') || currentUrl.includes('localhost')) {
      // 現在のURLに基づいてリダイレクトURLを設定
      console.log('Setting redirect URL to:', currentUrl)
    }
  }
  
  return client
}

export function createClient() {
  return createBrowserClient()
}
