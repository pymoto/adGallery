-- reportsテーブルのRLSを一時的に無効化するスクリプト
-- 更新処理のテスト用

-- 1. reportsテーブルのRLSを無効化
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;

-- 2. 現在のRLS設定を確認
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'reports';

-- 3. 通報の更新テスト
UPDATE reports 
SET status = 'rejected' 
WHERE id = '6c013079-dc4f-4ffd-942d-27971b102dac'
RETURNING id, status, created_at;

-- 4. 更新結果を確認
SELECT 
  id, 
  status, 
  created_at
FROM reports 
WHERE id = '6c013079-dc4f-4ffd-942d-27971b102dac';
