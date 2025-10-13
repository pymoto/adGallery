-- 特定のユーザーを管理者に設定
-- あなたのメールアドレスに置き換えてください
UPDATE profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';

-- または、ユーザーIDで直接設定
-- UPDATE profiles 
-- SET is_admin = true 
-- WHERE id = 'your-user-id-here';

-- 現在のプロフィール状況を確認
SELECT id, email, name, is_admin, created_at 
FROM profiles 
ORDER BY created_at DESC;
