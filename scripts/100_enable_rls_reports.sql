-- reportsテーブルのRLSを再有効化するスクリプト
-- テスト完了後にRLSを元に戻す

-- 1. reportsテーブルのRLSを有効化
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 2. 現在のRLS設定を確認
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'reports';

-- 3. 通報の現在の状態を確認
SELECT 
  id, 
  status, 
  created_at
FROM reports 
WHERE id = '6c013079-dc4f-4ffd-942d-27971b102dac';
