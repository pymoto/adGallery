-- 全ユーザーの確認
SELECT 
    id,
    email,
    name,
    is_admin,
    created_at
FROM profiles 
ORDER BY created_at DESC;

-- プロフィールデータの件数確認
SELECT COUNT(*) as total_profiles FROM profiles;

-- auth.usersとの比較
SELECT 
    au.id as auth_id,
    au.email as auth_email,
    au.created_at as auth_created_at,
    p.id as profile_id,
    p.email as profile_email,
    p.is_admin,
    p.created_at as profile_created_at
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC;
