-- データベースのタイムアウト設定を確認

-- 1. 現在のタイムアウト設定を確認
SELECT 
    name,
    setting,
    unit,
    context
FROM pg_settings 
WHERE name IN (
    'statement_timeout',
    'idle_in_transaction_session_timeout',
    'lock_timeout'
);

-- 2. 現在のセッション情報を確認
SELECT 
    pid,
    state,
    query_start,
    state_change,
    query
FROM pg_stat_activity 
WHERE state = 'active' 
ORDER BY query_start DESC
LIMIT 5;
