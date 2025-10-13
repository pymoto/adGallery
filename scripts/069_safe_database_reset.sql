-- 権限不要の安全なデータベースリセット

-- 1. 現在の接続状態を確認
SELECT 
    count(*) as total_connections,
    count(*) FILTER (WHERE state = 'active') as active_connections,
    count(*) FILTER (WHERE state = 'idle') as idle_connections
FROM pg_stat_activity;

-- 2. 長時間実行中のクエリを確認
SELECT 
    pid,
    state,
    query_start,
    now() - query_start as duration,
    left(query, 100) as query_preview
FROM pg_stat_activity 
WHERE state = 'active' 
AND now() - query_start > interval '1 second'
ORDER BY duration DESC;

-- 3. データベース統計を更新
ANALYZE;

-- 4. 現在のタイムアウト設定を確認
SELECT 
    name,
    setting,
    unit
FROM pg_settings 
WHERE name IN (
    'statement_timeout',
    'idle_in_transaction_session_timeout',
    'lock_timeout'
);

-- 5. セッションタイムアウトを延長
SET statement_timeout = '60s';
SET idle_in_transaction_session_timeout = '10min';
SET lock_timeout = '30s';
