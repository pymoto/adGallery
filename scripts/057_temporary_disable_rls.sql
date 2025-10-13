-- 一時的にRLSを無効化（デバッグ用）

-- 注意: 本番環境では実行しないでください
-- これは問題の特定のための一時的な措置です

-- 1. adsテーブルのRLSを一時的に無効化
ALTER TABLE ads DISABLE ROW LEVEL SECURITY;

-- 2. 確認
SELECT 
    relname AS table_name,
    relrowsecurity AS rls_enabled
FROM pg_class 
WHERE relname = 'ads';

-- 3. テスト用の簡単な挿入クエリ
-- このクエリが正常に動作するかテストしてください
SELECT 'RLS disabled for testing' AS status;
