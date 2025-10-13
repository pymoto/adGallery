-- 緊急修正: RLSを一時的に無効化
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 結果確認
SELECT 
    id,
    email,
    name,
    is_admin,
    created_at
FROM profiles 
ORDER BY created_at DESC;

-- 管理者権限でプロフィールを確認
SELECT 
    p.id,
    p.email,
    p.name,
    p.is_admin,
    p.created_at,
    au.id as auth_id,
    au.email as auth_email
FROM profiles p
LEFT JOIN auth.users au ON p.id = au.id
ORDER BY p.created_at DESC;
