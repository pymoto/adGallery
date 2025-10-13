-- データベースタイムアウト問題の根本解決

-- 1. すべてのアクティブな接続を強制終了（管理者権限不要）
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'active' 
AND pid <> pg_backend_pid()
AND query NOT LIKE '%pg_terminate_backend%';

-- 2. データベース統計を完全更新
ANALYZE;

-- 3. タイムアウト設定を大幅に延長
SET statement_timeout = '300s';  -- 5分
SET idle_in_transaction_session_timeout = '30min';
SET lock_timeout = '60s';

-- 4. 現在の設定を確認
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

-- 5. 接続状態を再確認
SELECT 
    count(*) as total_connections,
    count(*) FILTER (WHERE state = 'active') as active_connections,
    count(*) FILTER (WHERE state = 'idle') as idle_connections
FROM pg_stat_activity;
