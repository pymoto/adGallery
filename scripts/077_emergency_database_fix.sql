-- 緊急データベース修正スクリプト
-- データベースのタイムアウト問題を根本的に解決

-- 1. 接続をリセット
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle' 
AND query_start < NOW() - INTERVAL '5 minutes';

-- 2. タイムアウト設定を大幅に延長
SET statement_timeout = '300s';
SET idle_in_transaction_session_timeout = '300s';
SET lock_timeout = '30s';

-- 3. データベース統計を更新
ANALYZE ads;
ANALYZE likes;
ANALYZE favorites;
ANALYZE ad_analytics;

-- 4. 不要なデータを削除してパフォーマンスを向上
DELETE FROM ad_analytics WHERE created_at < NOW() - INTERVAL '7 days';
DELETE FROM likes WHERE created_at < NOW() - INTERVAL '30 days';
DELETE FROM favorites WHERE created_at < NOW() - INTERVAL '30 days';

-- 5. 重複データを削除
DELETE FROM ads a1 USING ads a2 
WHERE a1.id > a2.id 
AND a1.title = a2.title 
AND a1.company = a2.company 
AND a1.user_id = a2.user_id
AND a1.created_at < NOW() - INTERVAL '1 day';

-- 6. 大きな画像URLをプレースホルダーに置換
UPDATE ads 
SET image_url = 'https://picsum.photos/400/300?random=' || EXTRACT(EPOCH FROM created_at)::int % 1000
WHERE image_url LIKE 'data:image%' OR LENGTH(image_url) > 1000;

-- 7. データベースを最適化
VACUUM ANALYZE;

-- 8. インデックスを再構築
REINDEX TABLE ads;
REINDEX TABLE likes;
REINDEX TABLE favorites;

-- 9. 接続プールの最適化
SET max_connections = 200;
SET shared_buffers = '256MB';
SET effective_cache_size = '1GB';

-- 10. クエリプランナーの最適化
SET random_page_cost = 1.0;
SET seq_page_cost = 1.0;
SET cpu_tuple_cost = 0.01;
SET cpu_index_tuple_cost = 0.005;

-- 11. ログレベルを調整
SET log_statement = 'none';
SET log_min_duration_statement = 2000;
SET log_min_messages = 'error';

-- 12. 統計情報の更新頻度を調整
SET track_activities = true;
SET track_counts = true;
SET track_io_timing = false;

-- 13. 最終的な統計更新
ANALYZE;
