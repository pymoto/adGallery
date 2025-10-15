-- ステージング環境に決済関連テーブルを追加するスクリプト

-- 1. 価格設定テーブル
CREATE TABLE IF NOT EXISTS public.pricing_tiers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    price INTEGER NOT NULL,
    max_uses INTEGER DEFAULT NULL,
    current_uses INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 決済テーブル
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    ad_id UUID REFERENCES public.ads(id) ON DELETE CASCADE,
    pricing_tier_id UUID REFERENCES public.pricing_tiers(id),
    amount INTEGER NOT NULL,
    stripe_session_id TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. インデックス作成
CREATE INDEX IF NOT EXISTS idx_pricing_tiers_name ON public.pricing_tiers(name);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_ad_id ON public.payments(ad_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- 4. RLS有効化
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 5. RLSポリシー
-- 価格設定は誰でも閲覧可能
CREATE POLICY "Pricing tiers are viewable by everyone" ON public.pricing_tiers
    FOR SELECT USING (true);

-- 管理者は価格設定を管理可能
CREATE POLICY "Admins can manage pricing tiers" ON public.pricing_tiers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- ユーザーは自分の決済を閲覧可能
CREATE POLICY "Users can view their own payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

-- 管理者はすべての決済を閲覧可能
CREATE POLICY "Admins can view all payments" ON public.payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- 6. 初期データの挿入
INSERT INTO public.pricing_tiers (name, price, max_uses, current_uses, is_active) VALUES
('sale', 500, 100, 0, true),
('regular', 5000, NULL, 0, true)
ON CONFLICT (name) DO UPDATE SET
    price = EXCLUDED.price,
    max_uses = EXCLUDED.max_uses,
    current_uses = EXCLUDED.current_uses,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- 7. テーブルの確認
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 8. 初期データの確認
SELECT * FROM public.pricing_tiers;
