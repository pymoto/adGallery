-- 決済待ちの広告データを一時保存するテーブル
CREATE TABLE IF NOT EXISTS pending_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 古いデータを自動削除（24時間以上経過したもの）
CREATE INDEX IF NOT EXISTS idx_pending_ads_created_at ON pending_ads(created_at);

-- 誰でもpending_adsテーブルにアクセスできるようにRLSを設定
ALTER TABLE pending_ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert pending ads" ON pending_ads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can read pending ads" ON pending_ads
  FOR SELECT USING (true);

CREATE POLICY "Anyone can delete pending ads" ON pending_ads
  FOR DELETE USING (true);
