-- データベースインデックス最適化スクリプト
-- パフォーマンスを大幅に向上させる

-- 1. 既存のインデックスを削除
DROP INDEX IF EXISTS idx_ads_created_at;
DROP INDEX IF EXISTS idx_ads_category;
DROP INDEX IF EXISTS idx_ads_published;
DROP INDEX IF EXISTS idx_ads_user_id;
DROP INDEX IF EXISTS idx_likes_user_id;
DROP INDEX IF EXISTS idx_likes_ad_id;
DROP INDEX IF EXISTS idx_favorites_user_id;
DROP INDEX IF EXISTS idx_favorites_ad_id;

-- 2. 最適化されたインデックスを作成
-- ads テーブルのインデックス
CREATE INDEX CONCURRENTLY idx_ads_published_created_at 
ON ads (is_published, created_at DESC) 
WHERE is_published = true;

CREATE INDEX CONCURRENTLY idx_ads_category_published 
ON ads (category, is_published, created_at DESC) 
WHERE is_published = true;

CREATE INDEX CONCURRENTLY idx_ads_user_id_created_at 
ON ads (user_id, created_at DESC);

-- likes テーブルのインデックス
CREATE INDEX CONCURRENTLY idx_likes_user_id_created_at 
ON likes (user_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_likes_ad_id_created_at 
ON likes (ad_id, created_at DESC);

-- favorites テーブルのインデックス
CREATE INDEX CONCURRENTLY idx_favorites_user_id_created_at 
ON favorites (user_id, created_at DESC);

CREATE INDEX CONCURRENTLY idx_favorites_ad_id_created_at 
ON favorites (ad_id, created_at DESC);

-- 3. 部分インデックスでパフォーマンスを向上
CREATE INDEX CONCURRENTLY idx_ads_published_true 
ON ads (created_at DESC) 
WHERE is_published = true;

-- 4. 複合インデックスで検索を最適化
CREATE INDEX CONCURRENTLY idx_ads_search 
ON ads (is_published, category, created_at DESC) 
WHERE is_published = true;

-- 5. テキスト検索用のインデックス
CREATE INDEX CONCURRENTLY idx_ads_title_gin 
ON ads USING gin (to_tsvector('japanese', title)) 
WHERE is_published = true;

CREATE INDEX CONCURRENTLY idx_ads_company_gin 
ON ads USING gin (to_tsvector('japanese', company)) 
WHERE is_published = true;

-- 6. 統計情報を更新
ANALYZE ads;
ANALYZE likes;
ANALYZE favorites;

-- 7. データベースを最適化
VACUUM ANALYZE;
