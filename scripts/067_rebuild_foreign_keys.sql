-- 外部キー制約を完全に再構築

-- 1. 既存の外部キー制約をすべて削除
ALTER TABLE ads DROP CONSTRAINT IF EXISTS ads_user_id_fkey;
ALTER TABLE favorites DROP CONSTRAINT IF EXISTS favorites_user_id_fkey;
ALTER TABLE favorites DROP CONSTRAINT IF EXISTS favorites_ad_id_fkey;
ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_user_id_fkey;
ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_ad_id_fkey;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_user_id_fkey;
ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_ad_id_fkey;
ALTER TABLE reports DROP CONSTRAINT IF EXISTS reports_reporter_id_fkey;
ALTER TABLE reports DROP CONSTRAINT IF EXISTS reports_ad_id_fkey;

-- 2. 新しい外部キー制約を作成（CASCADE付き）
ALTER TABLE ads ADD CONSTRAINT ads_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE favorites ADD CONSTRAINT favorites_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE favorites ADD CONSTRAINT favorites_ad_id_fkey 
FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE;

ALTER TABLE likes ADD CONSTRAINT likes_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE likes ADD CONSTRAINT likes_ad_id_fkey 
FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE;

ALTER TABLE payments ADD CONSTRAINT payments_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE payments ADD CONSTRAINT payments_ad_id_fkey 
FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE;

ALTER TABLE reports ADD CONSTRAINT reports_reporter_id_fkey 
FOREIGN KEY (reporter_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE reports ADD CONSTRAINT reports_ad_id_fkey 
FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE;

-- 3. 制約の確認
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
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, tc.constraint_name;
