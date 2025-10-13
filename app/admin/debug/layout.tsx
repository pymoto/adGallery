"use client"

interface DebugLayoutProps {
  children: React.ReactNode
}

export default function DebugLayout({ children }: DebugLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  )
}
