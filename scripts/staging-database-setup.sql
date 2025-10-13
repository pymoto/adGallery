-- ステージング用データベースセットアップスクリプト
-- 既存のスキーマをステージング環境に適用

-- 1. 基本テーブル作成
CREATE TABLE IF NOT EXISTS public.ads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    link_url TEXT,
    category TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_published BOOLEAN DEFAULT NULL
);

-- 2. インデックス作成
CREATE INDEX IF NOT EXISTS idx_ads_category ON public.ads(category);
CREATE INDEX IF NOT EXISTS idx_ads_created_at ON public.ads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ads_user_id ON public.ads(user_id);
CREATE INDEX IF NOT EXISTS idx_ads_is_published ON public.ads(is_published);

-- 3. プロファイルテーブル
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. お気に入りテーブル
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ad_id UUID REFERENCES public.ads(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, ad_id)
);

-- 5. 通報テーブル
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ad_id UUID REFERENCES public.ads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. 分析テーブル
CREATE TABLE IF NOT EXISTS public.ad_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ad_id UUID REFERENCES public.ads(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. RLS有効化
ALTER TABLE public.ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ad_analytics ENABLE ROW LEVEL SECURITY;

-- 8. RLSポリシー作成
-- 広告の表示（公開済みのみ）
CREATE POLICY "Public ads are viewable by everyone" ON public.ads
    FOR SELECT USING (is_published = true);

-- ユーザーは自分の広告を管理可能
CREATE POLICY "Users can manage their own ads" ON public.ads
    FOR ALL USING (auth.uid() = user_id);

-- 管理者はすべての広告を管理可能
CREATE POLICY "Admins can manage all ads" ON public.ads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- プロファイルポリシー
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- お気に入りポリシー
CREATE POLICY "Users can manage their own favorites" ON public.favorites
    FOR ALL USING (auth.uid() = user_id);

-- 通報ポリシー
CREATE POLICY "Users can create reports" ON public.reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own reports" ON public.reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reports" ON public.reports
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- 分析ポリシー
CREATE POLICY "Analytics are viewable by everyone" ON public.ad_analytics
    FOR SELECT USING (true);

CREATE POLICY "Analytics can be inserted by everyone" ON public.ad_analytics
    FOR INSERT WITH CHECK (true);

-- 9. 関数作成
CREATE OR REPLACE FUNCTION increment_views(ad_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.ads 
    SET views = views + 1 
    WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. サンプルデータ挿入（オプション）
INSERT INTO public.ads (title, company, description, image_url, link_url, category, tags, is_published) VALUES
('サンプル広告1', 'サンプル会社', 'これはステージング用のサンプル広告です。', 'https://picsum.photos/400/300?random=1', 'https://example.com', 'tech', ARRAY['サンプル', 'テクノロジー'], true),
('サンプル広告2', 'サンプル会社2', 'これはステージング用のサンプル広告です。', 'https://picsum.photos/400/300?random=2', 'https://example.com', 'fashion', ARRAY['サンプル', 'ファッション'], true),
('サンプル広告3', 'サンプル会社3', 'これはステージング用のサンプル広告です。', 'https://picsum.photos/400/300?random=3', 'https://example.com', 'food', ARRAY['サンプル', 'フード'], true)
ON CONFLICT DO NOTHING;
