-- 簡単なRLS無効化スクリプト
-- 通報の更新テスト用

-- reportsテーブルのRLSを無効化
ALTER TABLE reports DISABLE ROW LEVEL SECURITY;

-- 確認
SELECT 'RLS disabled for reports table' as status;
