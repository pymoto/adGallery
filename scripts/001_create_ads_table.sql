-- 広告テーブルを作成
CREATE TABLE IF NOT EXISTS public.ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスを作成してクエリを高速化
CREATE INDEX IF NOT EXISTS idx_ads_category ON public.ads(category);
CREATE INDEX IF NOT EXISTS idx_ads_created_at ON public.ads(created_at DESC);

-- 誰でも広告を閲覧・作成できるようにRLSを無効化
-- （企業が自由に広告をアップロードでき、ユーザーが自由に閲覧できる公開プラットフォーム）
ALTER TABLE public.ads DISABLE ROW LEVEL SECURITY;
