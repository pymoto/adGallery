-- データベースパフォーマンス最適化

-- 1. adsテーブルのインデックスを追加
CREATE INDEX IF NOT EXISTS idx_ads_created_at ON ads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ads_category ON ads(category);
CREATE INDEX IF NOT EXISTS idx_ads_is_published ON ads(is_published);
CREATE INDEX IF NOT EXISTS idx_ads_user_id ON ads(user_id);
CREATE INDEX IF NOT EXISTS idx_ads_price ON ads(price);

-- 2. profilesテーブルのインデックスを追加
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_is_admin ON profiles(is_admin);
CREATE INDEX IF NOT EXISTS idx_profiles_created_at ON profiles(created_at DESC);

-- 3. reportsテーブルのインデックスを追加
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_ad_id ON reports(ad_id);
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON reports(reporter_id);

-- 4. favoritesテーブルのインデックスを追加
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_ad_id ON favorites(ad_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at DESC);

-- 5. 複合インデックスを追加（よく使われるクエリパターン用）
CREATE INDEX IF NOT EXISTS idx_ads_published_created ON ads(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ads_category_published ON ads(category, is_published);
CREATE INDEX IF NOT EXISTS idx_ads_user_published ON ads(user_id, is_published);

-- 6. 統計情報を更新
ANALYZE ads;
ANALYZE profiles;
ANALYZE reports;
ANALYZE favorites;
