-- reportsテーブルのRLSポリシーをテストするスクリプト
-- 管理者権限での更新テスト

-- 1. 現在のユーザーIDを確認
SELECT auth.uid() as current_user_id;

-- 2. 現在のプロフィールを確認
SELECT 
  id, 
  is_admin 
FROM profiles 
WHERE id = auth.uid();

-- 3. 通報の現在の状態を確認
SELECT 
  id, 
  status, 
  created_at
FROM reports 
WHERE id = '359ca6d0-0b9c-4661-912b-47951102e691';

-- 4. 管理者権限での更新テスト
UPDATE reports 
SET status = 'rejected' 
WHERE id = '359ca6d0-0b9c-4661-912b-47951102e691'
RETURNING id, status, created_at;

-- 5. 更新結果を確認
SELECT 
  id, 
  status, 
  created_at
FROM reports 
WHERE id = '359ca6d0-0b9c-4661-912b-47951102e691';
