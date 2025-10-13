-- 安全なデータベース最適化スクリプト（最終版）
-- 存在するテーブルのみを対象

-- 1. 接続をリセット
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle' 
AND query_start < NOW() - INTERVAL '2 minutes';

-- 2. タイムアウト設定を大幅に延長
SET statement_timeout = '600s';
SET idle_in_transaction_session_timeout = '600s';
SET lock_timeout = '60s';

-- 3. 存在するテーブルのみで古いデータを削除
-- likesテーブルから古いデータを削除（60日以上前）
DELETE FROM likes WHERE created_at < NOW() - INTERVAL '60 days';

-- favoritesテーブルから古いデータを削除（60日以上前）
DELETE FROM favorites WHERE created_at < NOW() - INTERVAL '60 days';

-- 4. 大きな画像URLをプレースホルダーに置換
UPDATE ads 
SET image_url = 'https://picsum.photos/400/300?random=' || EXTRACT(EPOCH FROM created_at)::int % 1000
WHERE image_url LIKE 'data:image%' OR LENGTH(image_url) > 1000;

-- 5. 重複データを削除
DELETE FROM ads a1 USING ads a2 
WHERE a1.id > a2.id 
AND a1.title = a2.title 
AND a1.company = a2.company 
AND a1.user_id = a2.user_id
AND a1.created_at < NOW() - INTERVAL '1 day';

-- 6. 統計情報を更新
ANALYZE ads;
ANALYZE likes;
ANALYZE favorites;

-- 7. インデックスを最適化
CREATE INDEX IF NOT EXISTS idx_ads_published_created_at 
ON ads (is_published, created_at DESC) 
WHERE is_published = true;

CREATE INDEX IF NOT EXISTS idx_ads_user_id_created_at 
ON ads (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_likes_user_id_created_at 
ON likes (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id_created_at 
ON favorites (user_id, created_at DESC);

-- 8. データベースを最適化
VACUUM ANALYZE;

-- 9. 最終的な統計更新
ANALYZE;
