-- 修正されたデータベース最適化スクリプト
-- 存在するテーブルのみを対象

-- 1. 基本的な統計情報を更新
ANALYZE ads;
ANALYZE likes;
ANALYZE favorites;

-- 2. 大きな画像URLをプレースホルダーに置換
UPDATE ads 
SET image_url = 'https://picsum.photos/400/300?random=' || EXTRACT(EPOCH FROM created_at)::int % 1000
WHERE image_url LIKE 'data:image%' OR LENGTH(image_url) > 1000;

-- 3. 基本的なインデックスを作成（存在しない場合のみ）
CREATE INDEX IF NOT EXISTS idx_ads_published_created_at 
ON ads (is_published, created_at DESC) 
WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_ads_category 
ON ads (category) 
WHERE is_published = true;

-- 4. 最終的な統計更新
ANALYZE;
