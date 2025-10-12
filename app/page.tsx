"use client"

import { AdGallery } from "@/components/ad-gallery"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-balance mb-3">広告デザインギャラリー</h1>
              <p className="text-lg text-muted-foreground text-pretty">
                クリエイティブな広告デザインを発見し、インスピレーションを得ましょう
              </p>
            </div>
            <Button size="lg" className="gap-2" asChild>
              <Link href="/auth/sign-up">
                <Upload className="w-5 h-5" />
                広告を投稿
              </Link>
            </Button>
          </div>
        </div>
        <AdGallery />
      </main>
    </div>
  )
}
