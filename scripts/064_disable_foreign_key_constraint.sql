-- 外部キー制約を一時的に無効化（テスト用）

-- 1. 現在の外部キー制約を確認
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'ads';

-- 2. 外部キー制約を一時的に無効化
-- 注意: 本番環境では実行しないでください
ALTER TABLE ads DROP CONSTRAINT IF EXISTS ads_user_id_fkey;

-- 3. 確認
SELECT 
    tc.constraint_name,
    tc.table_name
FROM information_schema.table_constraints AS tc 
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'ads';
