-- タイムアウト設定を調整

-- 1. セッションタイムアウトを延長（30秒）
SET statement_timeout = '30s';

-- 2. アイドルタイムアウトを延長（5分）
SET idle_in_transaction_session_timeout = '5min';

-- 3. ロックタイムアウトを延長（10秒）
SET lock_timeout = '10s';

-- 4. 設定確認
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
