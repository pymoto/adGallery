-- テスト用の通報データを作成するスクリプト
-- 通報が存在しない場合のテスト用

-- 1. テスト用の通報データを挿入
INSERT INTO reports (
  id,
  reason,
  description,
  status,
  created_at,
  ad_id,
  reporter_id
) VALUES (
  gen_random_uuid(),
  'spam',
  'テスト通報です',
  'pending',
  NOW(),
  (SELECT id FROM ads LIMIT 1),
  (SELECT id FROM auth.users LIMIT 1)
);

-- 2. 挿入されたデータを確認
SELECT 
  id, 
  reason, 
  status, 
  created_at,
  ad_id,
  reporter_id
FROM reports 
ORDER BY created_at DESC 
LIMIT 1;
