-- adsテーブルにlink_urlカラムを追加
ALTER TABLE public.ads ADD COLUMN IF NOT EXISTS link_url TEXT;

-- link_urlのインデックスを作成（オプション）
CREATE INDEX IF NOT EXISTS idx_ads_link_url ON public.ads(link_url) WHERE link_url IS NOT NULL;

