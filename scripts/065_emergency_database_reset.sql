-- 緊急データベースリセット

-- 1. すべてのアクティブな接続を確認
SELECT 
    pid,
    state,
    query_start,
    now() - query_start as duration,
    query
FROM pg_stat_activity 
WHERE state = 'active'
ORDER BY duration DESC;

-- 2. 長時間実行中のクエリを強制終了
-- 注意: 本番環境では慎重に実行してください
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'active' 
AND now() - query_start > interval '30 seconds'
AND pid <> pg_backend_pid();

-- 3. データベース統計をリセット
ANALYZE;

-- 4. 接続プールをリセット
SELECT pg_reload_conf();
