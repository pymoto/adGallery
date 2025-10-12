-- 広告分析用テーブルを作成（修正版）

-- 既存のテーブルを削除（存在する場合）
DROP TABLE IF EXISTS public.link_clicks CASCADE;
DROP TABLE IF EXISTS public.ad_views CASCADE;

-- 広告閲覧履歴テーブル
CREATE TABLE public.ad_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_id UUID REFERENCES public.ads(id) ON DELETE CASCADE NOT NULL,
    user_id UUID, -- ログインしているユーザーのID（匿名閲覧の場合はNULL）
    ip_address INET,
    user_agent TEXT,
    device_type TEXT, -- 'desktop', 'mobile', 'tablet'
    browser TEXT,
    os TEXT,
    country TEXT,
    city TEXT,
    referrer TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- リンククリック履歴テーブル
CREATE TABLE public.link_clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ad_id UUID REFERENCES public.ads(id) ON DELETE CASCADE NOT NULL,
    user_id UUID, -- ログインしているユーザーのID（匿名クリックの場合はNULL）
    ip_address INET,
    user_agent TEXT,
    device_type TEXT, -- 'desktop', 'mobile', 'tablet'
    browser TEXT,
    os TEXT,
    country TEXT,
    city TEXT,
    referrer TEXT,
    clicked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- インデックスを作成（パフォーマンス向上）
CREATE INDEX idx_ad_views_ad_id ON public.ad_views(ad_id);
CREATE INDEX idx_ad_views_viewed_at ON public.ad_views(viewed_at DESC);
CREATE INDEX idx_ad_views_device_type ON public.ad_views(device_type);
CREATE INDEX idx_ad_views_user_id ON public.ad_views(user_id);

CREATE INDEX idx_link_clicks_ad_id ON public.link_clicks(ad_id);
CREATE INDEX idx_link_clicks_clicked_at ON public.link_clicks(clicked_at DESC);
CREATE INDEX idx_link_clicks_device_type ON public.link_clicks(device_type);
CREATE INDEX idx_link_clicks_user_id ON public.link_clicks(user_id);

-- RLS（Row Level Security）を設定
ALTER TABLE public.ad_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_clicks ENABLE ROW LEVEL SECURITY;

-- 閲覧履歴のポリシー
CREATE POLICY "Enable read access for ad owners" ON public.ad_views
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.ads 
            WHERE ads.id = ad_views.ad_id 
            AND ads.user_id = auth.uid()
        )
    );

CREATE POLICY "Enable insert for all users" ON public.ad_views
    FOR INSERT WITH CHECK (true);

-- クリック履歴のポリシー
CREATE POLICY "Enable read access for ad owners" ON public.link_clicks
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.ads 
            WHERE ads.id = link_clicks.ad_id 
            AND ads.user_id = auth.uid()
        )
    );

CREATE POLICY "Enable insert for all users" ON public.link_clicks
    FOR INSERT WITH CHECK (true);
