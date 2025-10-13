-- 初期管理者設定スクリプト
-- このスクリプトを実行する前に、対象ユーザーが登録済みであることを確認してください

-- 特定のメールアドレスのユーザーに管理者権限を付与
-- メールアドレスを実際の値に変更してください
UPDATE profiles 
SET is_admin = true 
WHERE email = 'admin@example.com';

-- 管理者権限が付与されたか確認
SELECT 
    id,
    email,
    name,
    is_admin,
    created_at
FROM profiles 
WHERE is_admin = true;

-- 管理者権限を削除する場合（必要に応じて）
-- UPDATE profiles SET is_admin = false WHERE email = 'admin@example.com';
