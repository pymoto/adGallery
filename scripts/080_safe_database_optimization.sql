-- 安全なデータベース最適化スクリプト
-- 段階的に最適化を実行

-- 1. まず統計情報を更新
ANALYZE ads;
ANALYZE likes;
ANALYZE favorites;

-- 2. 古いデータを削除（安全な範囲で）
DELETE FROM ad_analytics WHERE created_at < NOW() - INTERVAL '30 days';

-- 3. 大きな画像URLをプレースホルダーに置換
UPDATE ads 
SET image_url = 'https://picsum.photos/400/300?random=' || EXTRACT(EPOCH FROM created_at)::int % 1000
WHERE image_url LIKE 'data:image%' OR LENGTH(image_url) > 1000;

-- 4. 基本的なインデックスを作成（存在しない場合のみ）
CREATE INDEX IF NOT EXISTS idx_ads_published_created_at 
ON ads (is_published, created_at DESC) 
WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_ads_category 
ON ads (category) 
WHERE is_published = true;

-- 5. 最終的な統計更新
ANALYZE;
