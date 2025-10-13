-- ログレベル調整スクリプト
-- データベースのログ出力を削減

-- 1. ログレベルを調整
SET log_statement = 'none';
SET log_min_duration_statement = 1000; -- 1秒以上かかるクエリのみログ
SET log_min_messages = 'warning';

-- 2. 統計情報の更新頻度を調整
SET track_activities = true;
SET track_counts = true;
SET track_io_timing = false; -- I/Oタイミングの追跡を無効化

-- 3. 接続プールの最適化
SET max_connections = 100;
SET shared_buffers = '128MB';
SET effective_cache_size = '512MB';

-- 4. クエリプランナーの最適化
SET random_page_cost = 1.1;
SET seq_page_cost = 1.0;
SET cpu_tuple_cost = 0.01;
SET cpu_index_tuple_cost = 0.005;
