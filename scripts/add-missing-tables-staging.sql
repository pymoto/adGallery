-- ステージング環境に不足しているテーブルを追加するスクリプト

-- 1. likesテーブルの作成
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ad_id UUID REFERENCES public.ads(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, ad_id)
);

-- 2. likesテーブルのインデックス
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON public.likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_ad_id ON public.likes(ad_id);
CREATE INDEX IF NOT EXISTS idx_likes_created_at ON public.likes(created_at DESC);

-- 3. likesテーブルのRLS有効化
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- 4. likesテーブルのRLSポリシー
CREATE POLICY "Users can manage their own likes" ON public.likes
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Likes are viewable by everyone" ON public.likes
    FOR SELECT USING (true);

-- 5. 既存テーブルの確認
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 6. likesテーブルの確認
SELECT * FROM public.likes LIMIT 5;
