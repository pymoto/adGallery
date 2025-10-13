-- 完全なprofilesテーブル修正スクリプト
-- 1. 既存のポリシーをすべて削除
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;

-- 2. RLSを一時的に無効化
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 3. 既存のプロフィールデータをバックアップ（念のため）
CREATE TEMP TABLE profiles_backup AS SELECT * FROM profiles;

-- 4. プロフィールテーブルを削除して再作成
DROP TABLE IF EXISTS profiles CASCADE;

-- 5. 新しいprofilesテーブルを作成
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. RLSを有効化
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 7. シンプルで安全なポリシーを作成
-- ユーザーは自分のプロフィールを読み取り可能
CREATE POLICY "Users can read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- ユーザーは自分のプロフィールを更新可能
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- ユーザーは自分のプロフィールを挿入可能
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 8. 既存のユーザーに対してプロフィールを作成
INSERT INTO profiles (id, email, name, is_admin)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)) as name,
    false as is_admin
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 9. 最初のユーザーを管理者に設定（最初に登録されたユーザー）
UPDATE profiles 
SET is_admin = true 
WHERE id = (
    SELECT id FROM profiles 
    ORDER BY created_at ASC 
    LIMIT 1
);

-- 10. 結果を確認
SELECT id, email, name, is_admin, created_at 
FROM profiles 
ORDER BY created_at ASC;
