-- 認証状態とユーザー情報を確認

-- 1. 現在の認証ユーザー情報を確認
SELECT 
    auth.uid() AS current_user_id,
    auth.email() AS current_user_email,
    auth.role() AS current_role;

-- 2. profilesテーブルの現在のユーザー情報を確認
SELECT 
    id,
    email,
    name,
    is_admin,
    created_at
FROM profiles 
WHERE id = auth.uid();

-- 3. 認証セッション情報を確認
SELECT 
    user_id,
    created_at,
    updated_at
FROM auth.sessions 
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 1;
