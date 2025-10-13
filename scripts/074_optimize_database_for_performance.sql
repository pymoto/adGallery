-- データベースパフォーマンス最適化スクリプト
-- Supabaseの使用制限を回避するための最適化

-- 1. 不要なデータを削除してデータベースサイズを削減
DELETE FROM ad_analytics WHERE created_at < NOW() - INTERVAL '30 days';
DELETE FROM likes WHERE created_at < NOW() - INTERVAL '30 days';
DELETE FROM favorites WHERE created_at < NOW() - INTERVAL '30 days';

-- 2. 古い広告を削除（30日以上前で未公開のもの）
DELETE FROM ads WHERE created_at < NOW() - INTERVAL '30 days' AND is_published = false;

-- 3. 重複データを削除
DELETE FROM ads a1 USING ads a2 
WHERE a1.id > a2.id 
AND a1.title = a2.title 
AND a1.company = a2.company 
AND a1.user_id = a2.user_id;

-- 4. インデックスを最適化
CREATE INDEX IF NOT EXISTS idx_ads_published_created ON ads(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ads_category_published ON ads(category, is_published);
CREATE INDEX IF NOT EXISTS idx_ads_user_id ON ads(user_id);

-- 5. 統計情報を更新
ANALYZE ads;
ANALYZE likes;
ANALYZE favorites;
ANALYZE ad_analytics;

-- 6. データベースを最適化
VACUUM ANALYZE;

-- 7. タイムアウト設定を調整
SET statement_timeout = '60s';
SET idle_in_transaction_session_timeout = '60s';
SET lock_timeout = '10s';

-- 8. 接続プールの最適化
-- (Supabaseでは直接実行できないため、コメントアウト)
-- SET max_connections = 100;
-- SET shared_buffers = '256MB';
-- SET effective_cache_size = '1GB';
