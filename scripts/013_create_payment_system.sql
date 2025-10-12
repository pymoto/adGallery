-- 決済システム用テーブルを作成

-- 既存のテーブルを削除（存在する場合）
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.pricing_tiers CASCADE;

-- 価格設定テーブル
CREATE TABLE public.pricing_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL, -- 'regular', 'sale'
    price INTEGER NOT NULL, -- 価格（円）
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    max_uses INTEGER, -- 最大使用回数（セール用）
    current_uses INTEGER DEFAULT 0, -- 現在の使用回数
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 決済履歴テーブル
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    ad_id UUID REFERENCES public.ads(id) ON DELETE CASCADE,
    pricing_tier_id UUID REFERENCES public.pricing_tiers(id),
    amount INTEGER NOT NULL, -- 支払い金額（円）
    currency TEXT DEFAULT 'jpy',
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_session_id TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'cancelled'
    payment_method TEXT, -- 'card', 'bank_transfer', etc.
    metadata JSONB, -- 追加情報
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE
);

-- インデックスを作成
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_ad_id ON public.payments(ad_id);
CREATE INDEX idx_payments_status ON public.payments(status);
CREATE INDEX idx_payments_stripe_payment_intent_id ON public.payments(stripe_payment_intent_id);
CREATE INDEX idx_payments_stripe_session_id ON public.payments(stripe_session_id);
CREATE INDEX idx_payments_created_at ON public.payments(created_at DESC);

-- RLS（Row Level Security）を設定
ALTER TABLE public.pricing_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- 価格設定のポリシー（誰でも閲覧可能）
CREATE POLICY "Enable read access for all users" ON public.pricing_tiers
    FOR SELECT USING (true);

-- 決済履歴のポリシー
CREATE POLICY "Enable read access for payment owners" ON public.payments
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Enable insert for authenticated users" ON public.payments
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Enable update for payment owners" ON public.payments
    FOR UPDATE USING (user_id = auth.uid());

-- 初期データを挿入
INSERT INTO public.pricing_tiers (name, price, description, max_uses, current_uses) VALUES
('sale', 500, '先着100投稿セール', 100, 0),
('regular', 5000, '通常価格', NULL, 0);

-- 現在の価格を取得する関数
CREATE OR REPLACE FUNCTION get_current_price()
RETURNS INTEGER AS $$
DECLARE
    sale_tier RECORD;
    regular_tier RECORD;
BEGIN
    -- セール価格を取得
    SELECT * INTO sale_tier FROM public.pricing_tiers 
    WHERE name = 'sale' AND is_active = true;
    
    -- 通常価格を取得
    SELECT * INTO regular_tier FROM public.pricing_tiers 
    WHERE name = 'regular' AND is_active = true;
    
    -- セールが有効で、まだ上限に達していない場合はセール価格
    IF sale_tier.current_uses < sale_tier.max_uses THEN
        RETURN sale_tier.price;
    ELSE
        RETURN regular_tier.price;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 価格更新関数
CREATE OR REPLACE FUNCTION update_pricing_usage()
RETURNS TRIGGER AS $$
BEGIN
    -- 決済が完了した場合のみ使用回数を更新
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE public.pricing_tiers 
        SET current_uses = current_uses + 1 
        WHERE id = NEW.pricing_tier_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガーを作成
CREATE TRIGGER update_pricing_usage_trigger
    AFTER UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION update_pricing_usage();

-- 関数の実行権限を設定
GRANT EXECUTE ON FUNCTION get_current_price() TO authenticated;
GRANT EXECUTE ON FUNCTION get_current_price() TO anon;
GRANT EXECUTE ON FUNCTION update_pricing_usage() TO authenticated;
GRANT EXECUTE ON FUNCTION update_pricing_usage() TO anon;

