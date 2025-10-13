-- Egress制限対策：データ転送量を最小化

-- 1. 不要なカラムの削除（大きなデータを削除）
-- 画像URLを短縮（base64を削除してURLのみに）
UPDATE ads 
SET image_url = 'https://via.placeholder.com/400x300?text=Image'
WHERE image_url LIKE 'data:image%';

-- 2. 大きなテキストフィールドの最適化
UPDATE ads 
SET description = LEFT(description, 500)
WHERE LENGTH(description) > 500;

-- 3. 古いアナリティクスデータの削除（Egress消費の主要原因）
DELETE FROM ad_analytics 
WHERE created_at < NOW() - INTERVAL '7 days';

-- 4. 未使用のセッションデータの削除
DELETE FROM payments 
WHERE status = 'pending' 
AND created_at < NOW() - INTERVAL '1 day';

-- 5. インデックスの最適化（クエリ効率化）
CREATE INDEX IF NOT EXISTS idx_ads_published_created 
ON ads(is_published, created_at DESC) 
WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_ads_user_published 
ON ads(user_id, is_published) 
WHERE is_published = true;

-- 6. データベース統計の更新
ANALYZE;

-- 7. 現在のテーブルサイズを確認
SELECT 
    tablename,
    pg_size_pretty(pg_total_relation_size('public.'||tablename)) as size,
    pg_size_pretty(pg_relation_size('public.'||tablename)) as table_size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size('public.'||tablename) DESC;
