-- データベース接続とパフォーマンスを確認

-- 1. 現在の接続数を確認
SELECT 
    count(*) as active_connections,
    state
FROM pg_stat_activity 
WHERE state = 'active'
GROUP BY state;

-- 2. 長時間実行中のクエリを確認
SELECT 
    pid,
    state,
    query_start,
    now() - query_start as duration,
    query
FROM pg_stat_activity 
WHERE state = 'active' 
AND now() - query_start > interval '1 second'
ORDER BY duration DESC;

-- 3. ロック情報を確認
SELECT 
    locktype,
    mode,
    granted,
    pid
FROM pg_locks 
WHERE NOT granted
ORDER BY pid;

-- 4. データベースサイズを確認
SELECT 
    pg_size_pretty(pg_database_size(current_database())) as database_size;
