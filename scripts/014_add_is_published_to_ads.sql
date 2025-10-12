-- 広告テーブルにis_publishedカラムを追加

-- is_publishedカラムを追加（デフォルトはtrueで既存の広告は公開状態）
ALTER TABLE public.ads 
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;

-- 既存の広告はすべて公開状態にする
UPDATE public.ads 
SET is_published = true 
WHERE is_published IS NULL;

-- インデックスを作成（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_ads_is_published ON public.ads(is_published);

-- 公開されている広告のみを表示するビューを作成
CREATE OR REPLACE VIEW public.published_ads AS
SELECT * FROM public.ads 
WHERE is_published = true;

