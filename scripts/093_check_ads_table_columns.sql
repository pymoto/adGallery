-- adsテーブルのカラム構造を確認するスクリプト
-- viewsとlikesカラムが存在するかチェック

-- 1. adsテーブルのカラム情報を取得
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'ads' 
ORDER BY ordinal_position;

-- 2. サンプルデータでviewsとlikesの値を確認
SELECT 
  id, 
  title, 
  views, 
  likes, 
  created_at
FROM ads 
ORDER BY created_at DESC 
LIMIT 5;
