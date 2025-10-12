-- adsテーブルにuser_idカラムを追加
ALTER TABLE ads ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- likesテーブルを作成
CREATE TABLE IF NOT EXISTS likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ad_id UUID NOT NULL REFERENCES ads(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, ad_id)
);

-- likesテーブルのインデックスを作成
CREATE INDEX IF NOT EXISTS idx_likes_user_id ON likes(user_id);
CREATE INDEX IF NOT EXISTS idx_likes_ad_id ON likes(ad_id);

-- adsテーブルのRLSを有効化
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- 誰でも広告を閲覧できる
CREATE POLICY "Anyone can view ads" ON ads FOR SELECT USING (true);

-- ログインユーザーのみ広告を作成できる
CREATE POLICY "Authenticated users can create ads" ON ads FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 自分の広告のみ更新できる
CREATE POLICY "Users can update their own ads" ON ads FOR UPDATE USING (auth.uid() = user_id);

-- 自分の広告のみ削除できる
CREATE POLICY "Users can delete their own ads" ON ads FOR DELETE USING (auth.uid() = user_id);

-- likesテーブルのRLSを有効化
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- 誰でもいいねを閲覧できる
CREATE POLICY "Anyone can view likes" ON likes FOR SELECT USING (true);

-- ログインユーザーのみいいねを作成できる
CREATE POLICY "Authenticated users can create likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 自分のいいねのみ削除できる
CREATE POLICY "Users can delete their own likes" ON likes FOR DELETE USING (auth.uid() = user_id);
