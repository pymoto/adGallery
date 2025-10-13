-- 緊急対応: RLSを完全にリセット

-- 1. すべてのRLSポリシーを削除
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can delete all profiles" ON profiles;

-- 2. RLSを完全に無効化
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 3. データの確認（RLS無効時）
SELECT 
    id,
    email,
    name,
    is_admin,
    created_at
FROM profiles 
ORDER BY created_at DESC;

-- 4. 注意: デバッグが完了したら、RLSを再度有効にする必要があります
-- 現在はRLSが無効になっているため、セキュリティが低下しています
