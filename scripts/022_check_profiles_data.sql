-- プロフィールデータの確認スクリプト

-- 1. プロフィールテーブルの構造確認
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- 2. プロフィールデータの確認
SELECT 
    id,
    email,
    name,
    is_admin,
    created_at
FROM profiles 
ORDER BY created_at DESC;

-- 3. プロフィールデータの件数確認
SELECT COUNT(*) as total_profiles FROM profiles;

-- 4. 管理者の数確認
SELECT COUNT(*) as admin_count FROM profiles WHERE is_admin = true;

-- 5. 一般ユーザーの数確認
SELECT COUNT(*) as user_count FROM profiles WHERE is_admin = false;

-- 6. auth.usersとの比較
SELECT 
    au.id as auth_id,
    au.email as auth_email,
    p.id as profile_id,
    p.email as profile_email,
    p.is_admin
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
ORDER BY au.created_at DESC;
