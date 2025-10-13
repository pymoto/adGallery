-- reportsテーブルのデータを確認するスクリプト
-- 実際のデータが存在するかチェック

-- 1. reportsテーブルの全データを確認
SELECT 
  id, 
  reason, 
  status, 
  created_at,
  updated_at,
  admin_note,
  ad_id,
  reporter_id
FROM reports 
ORDER BY created_at DESC;

-- 2. reportsテーブルの行数を確認
SELECT COUNT(*) as total_reports FROM reports;

-- 3. 各ステータスの通報数を確認
SELECT 
  status,
  COUNT(*) as count
FROM reports 
GROUP BY status;
