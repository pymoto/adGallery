-- Supabase使用上限対策：データベースの最適化

-- 1. 古いデータの削除（30日以上前）
DELETE FROM ads 
WHERE created_at < NOW() - INTERVAL '30 days'
AND is_published = false;

-- 2. 重複データの削除
DELETE FROM ads 
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (
            PARTITION BY title, company, user_id 
            ORDER BY created_at DESC
        ) as rn
        FROM ads
    ) t WHERE rn > 1
);

-- 3. 未使用のアナリティクスデータの削除
DELETE FROM ad_analytics 
WHERE created_at < NOW() - INTERVAL '7 days';

-- 4. 古い決済データの削除（完了済みのみ）
DELETE FROM payments 
WHERE status = 'completed' 
AND created_at < NOW() - INTERVAL '14 days';

-- 5. データベース統計の更新
ANALYZE;

-- 6. 現在のテーブルサイズを確認
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- 7. 行数を確認
SELECT 
    'ads' as table_name, 
    COUNT(*) as row_count 
FROM ads
UNION ALL
SELECT 
    'ad_analytics' as table_name, 
    COUNT(*) as row_count 
FROM ad_analytics
UNION ALL
SELECT 
    'payments' as table_name, 
    COUNT(*) as row_count 
FROM payments;
