-- reportsテーブルの詳細構造を確認するスクリプト
-- カラムの存在とデータ型を詳細にチェック

-- 1. reportsテーブルの完全な構造を確認
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default,
  character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'reports' 
ORDER BY ordinal_position;

-- 2. 特定の通報の詳細情報を確認
SELECT 
  id, 
  reason, 
  status, 
  created_at,
  ad_id,
  reporter_id
FROM reports 
WHERE id = '6c013079-dc4f-4ffd-942d-27971b102dac';

-- 3. 通報の更新テスト（statusのみ）
UPDATE reports 
SET status = 'rejected' 
WHERE id = '6c013079-dc4f-4ffd-942d-27971b102dac'
RETURNING id, status;

-- 4. 更新結果を確認
SELECT 
  id, 
  status, 
  created_at
FROM reports 
WHERE id = '6c013079-dc4f-4ffd-942d-27971b102dac';
