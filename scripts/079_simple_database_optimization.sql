-- シンプルなデータベース最適化スクリプト
-- 基本的な最適化のみを実行

-- 1. 基本的な統計情報を更新
ANALYZE ads;
ANALYZE likes;
ANALYZE favorites;

-- 2. 不要なデータを削除（7日以上前の古いデータ）
DELETE FROM ad_analytics WHERE created_at < NOW() - INTERVAL '7 days';
DELETE FROM likes WHERE created_at < NOW() - INTERVAL '30 days';
DELETE FROM favorites WHERE created_at < NOW() - INTERVAL '30 days';

-- 3. 重複データを削除
DELETE FROM ads a1 USING ads a2 
WHERE a1.id > a2.id 
AND a1.title = a2.title 
AND a1.company = a2.company 
AND a1.user_id = a2.user_id
AND a1.created_at < NOW() - INTERVAL '1 day';

-- 4. 大きな画像URLをプレースホルダーに置換
UPDATE ads 
SET image_url = 'https://picsum.photos/400/300?random=' || EXTRACT(EPOCH FROM created_at)::int % 1000
WHERE image_url LIKE 'data:image%' OR LENGTH(image_url) > 1000;

-- 5. 基本的なインデックスを作成
CREATE INDEX IF NOT EXISTS idx_ads_published_created_at 
ON ads (is_published, created_at DESC) 
WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_ads_category 
ON ads (category) 
WHERE is_published = true;

-- 6. 最終的な統計更新
ANALYZE;
