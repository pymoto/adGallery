-- 簡単なRLS再有効化スクリプト
-- テスト完了後にRLSを元に戻す

-- reportsテーブルのRLSを有効化
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- 確認
SELECT 'RLS enabled for reports table' as status;
