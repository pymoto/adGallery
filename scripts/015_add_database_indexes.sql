-- データベースパフォーマンス向上のためのインデックス追加

-- 広告テーブルのインデックス
CREATE INDEX IF NOT EXISTS idx_ads_created_at ON ads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ads_category ON ads(category);
CREATE INDEX IF NOT EXISTS idx_ads_is_published ON ads(is_published);
CREATE INDEX IF NOT EXISTS idx_ads_user_id ON ads(user_id);

-- 複合インデックス（公開済み広告の作成日順）
CREATE INDEX IF NOT EXISTS idx_ads_published_created ON ads(is_published, created_at DESC) WHERE is_published = true;

-- テキスト検索用のインデックス
CREATE INDEX IF NOT EXISTS idx_ads_title_text ON ads USING gin(to_tsvector('japanese', title));
CREATE INDEX IF NOT EXISTS idx_ads_description_text ON ads USING gin(to_tsvector('japanese', description));
CREATE INDEX IF NOT EXISTS idx_ads_company_text ON ads USING gin(to_tsvector('japanese', company));

-- タグ検索用のインデックス
CREATE INDEX IF NOT EXISTS idx_ads_tags ON ads USING gin(tags);

-- 決済テーブルのインデックス
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_ad_id ON payments(ad_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);

-- お気に入りテーブルのインデックス
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_ad_id ON favorites(ad_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at DESC);

-- 通報テーブルのインデックス（将来の実装用）
CREATE INDEX IF NOT EXISTS idx_reports_ad_id ON reports(ad_id);
CREATE INDEX IF NOT EXISTS idx_reports_reporter_id ON reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);

-- アナリティクステーブルのインデックス
CREATE INDEX IF NOT EXISTS idx_ad_analytics_ad_id ON ad_analytics(ad_id);
CREATE INDEX IF NOT EXISTS idx_ad_analytics_date ON ad_analytics(date);
CREATE INDEX IF NOT EXISTS idx_ad_analytics_ad_id_date ON ad_analytics(ad_id, date);

-- ビュー数の更新用インデックス
CREATE INDEX IF NOT EXISTS idx_ads_views ON ads(views DESC);
