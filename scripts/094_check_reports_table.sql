-- reportsテーブルの構造を確認するスクリプト
-- updated_atカラムが存在するかチェック

-- 1. reportsテーブルのカラム情報を取得
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns 
WHERE table_name = 'reports' 
ORDER BY ordinal_position;

-- 2. サンプルデータでreportsの値を確認
SELECT 
  id, 
  reason, 
  status, 
  created_at,
  updated_at,
  admin_note
FROM reports 
ORDER BY created_at DESC 
LIMIT 5;
