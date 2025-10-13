-- adsテーブルのスキーマを確認

-- 1. adsテーブルの構造を確認
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'ads' 
ORDER BY ordinal_position;

-- 2. adsテーブルのサンプルデータを確認
SELECT * FROM ads LIMIT 1;
