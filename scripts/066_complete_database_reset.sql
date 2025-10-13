-- データベースの完全リセット

-- 1. すべてのアクティブな接続を強制終了
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'active' 
AND pid <> pg_backend_pid();

-- 2. データベース統計を完全リセット
ANALYZE;

-- 3. 接続プールをリセット
SELECT pg_reload_conf();

-- 4. 現在の接続状態を確認
SELECT 
    count(*) as total_connections,
    count(*) FILTER (WHERE state = 'active') as active_connections,
    count(*) FILTER (WHERE state = 'idle') as idle_connections
FROM pg_stat_activity;

-- 5. 長時間実行中のクエリがないか確認
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
