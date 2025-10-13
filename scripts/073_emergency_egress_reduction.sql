-- 緊急Egress節約対策

-- 1. 大きな画像データの削除（base64画像を削除）
UPDATE ads 
SET image_url = 'https://via.placeholder.com/400x300?text=Optimized'
WHERE image_url LIKE 'data:image%';

-- 2. 長い説明文の短縮
UPDATE ads 
SET description = LEFT(description, 200)
WHERE LENGTH(description) > 200;

-- 3. 古いアナリティクスデータの完全削除
DELETE FROM ad_analytics;

-- 4. 未完了の決済データの削除
DELETE FROM payments 
WHERE status IN ('pending', 'failed');

-- 5. 重複広告の削除（同じタイトルと会社名）
DELETE FROM ads 
WHERE id IN (
    SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (
            PARTITION BY title, company 
            ORDER BY created_at DESC
        ) as rn
        FROM ads
    ) t WHERE rn > 1
);

-- 6. データベースの完全最適化
VACUUM ANALYZE;

-- 7. 現在の使用量を確認
SELECT 
    'Total rows' as metric,
    (SELECT COUNT(*) FROM ads) as ads_count,
    (SELECT COUNT(*) FROM ad_analytics) as analytics_count,
    (SELECT COUNT(*) FROM payments) as payments_count;
