-- 認証状態を完全にリセット

-- 1. 現在のセッションを確認
SELECT 
    user_id,
    created_at,
    updated_at
FROM auth.sessions 
ORDER BY created_at DESC
LIMIT 5;

-- 2. 古いセッションを削除（必要に応じて）
-- DELETE FROM auth.sessions WHERE created_at < NOW() - INTERVAL '1 hour';

-- 3. 認証状態の確認
SELECT 
    auth.uid() AS current_user_id,
    auth.email() AS current_user_email,
    auth.role() AS current_role;
