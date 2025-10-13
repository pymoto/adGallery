-- 認証問題を回避するための一時的なRLS無効化

-- 1. adsテーブルのRLSを無効化
ALTER TABLE ads DISABLE ROW LEVEL SECURITY;

-- 2. profilesテーブルのRLSも無効化（必要に応じて）
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- 3. 確認
SELECT 
    relname AS table_name,
    relrowsecurity AS rls_enabled
FROM pg_class 
WHERE relname IN ('ads', 'profiles')
ORDER BY relname;

-- 4. テスト用の簡単なクエリ
SELECT 'RLS disabled for testing' AS status;
