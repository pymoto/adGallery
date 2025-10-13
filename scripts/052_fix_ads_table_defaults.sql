-- adsテーブルのデフォルト値を修正

-- 1. is_publishedのデフォルト値をfalseに変更
ALTER TABLE ads ALTER COLUMN is_published SET DEFAULT false;

-- 2. 既存のデータでis_publishedがnullの場合はfalseに更新
UPDATE ads SET is_published = false WHERE is_published IS NULL;

-- 3. is_publishedカラムをNOT NULLに設定
ALTER TABLE ads ALTER COLUMN is_published SET NOT NULL;

-- 4. 結果確認
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'ads' AND column_name = 'is_published';
