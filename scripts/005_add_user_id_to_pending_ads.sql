-- pending_adsテーブルにuser_idカラムを追加
ALTER TABLE pending_ads ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- pending_adsテーブルのRLSを有効化
ALTER TABLE pending_ads ENABLE ROW LEVEL SECURITY;

-- ログインユーザーのみpending_adsを作成できる
CREATE POLICY "Authenticated users can create pending ads" ON pending_ads FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 自分のpending_adsのみ閲覧できる
CREATE POLICY "Users can view their own pending ads" ON pending_ads FOR SELECT USING (auth.uid() = user_id);

-- 自分のpending_adsのみ削除できる
CREATE POLICY "Users can delete their own pending ads" ON pending_ads FOR DELETE USING (auth.uid() = user_id);
