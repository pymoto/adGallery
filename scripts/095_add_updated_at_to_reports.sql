-- reportsテーブルにupdated_atカラムを追加するスクリプト
-- 既存のreportsテーブルにupdated_atカラムを追加

-- 1. updated_atカラムを追加
ALTER TABLE reports 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. 既存のレコードのupdated_atをcreated_atと同じ値に設定
UPDATE reports 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- 3. 変更結果を確認
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
