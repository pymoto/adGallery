-- 緊急データベースクリーンアップスクリプト
-- Supabaseの使用制限を回避するための緊急対策

-- 1. 古いデータを削除（30日以上前）
DELETE FROM ad_analytics WHERE created_at < NOW() - INTERVAL '30 days';
DELETE FROM likes WHERE created_at < NOW() - INTERVAL '30 days' AND created_at < NOW() - INTERVAL '7 days';
DELETE FROM favorites WHERE created_at < NOW() - INTERVAL '30 days' AND created_at < NOW() - INTERVAL '7 days';

-- 2. 未公開の古い広告を削除（7日以上前）
DELETE FROM ads WHERE created_at < NOW() - INTERVAL '7 days' AND is_published = false;

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

-- 5. 統計情報を更新
ANALYZE ads;
ANALYZE likes;
ANALYZE favorites;
ANALYZE ad_analytics;

-- 6. データベースを最適化
VACUUM ANALYZE;

-- 7. タイムアウト設定を調整
SET statement_timeout = '30s';
SET idle_in_transaction_session_timeout = '30s';
SET lock_timeout = '5s';
