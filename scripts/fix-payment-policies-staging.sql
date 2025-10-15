-- ステージング環境の決済関連ポリシーを修正するスクリプト

-- 1. 既存ポリシーの確認
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('pricing_tiers', 'payments');

-- 2. 既存ポリシーの削除
DROP POLICY IF EXISTS "Pricing tiers are viewable by everyone" ON public.pricing_tiers;
DROP POLICY IF EXISTS "Admins can manage pricing tiers" ON public.pricing_tiers;
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;

-- 3. 新しいポリシーの作成
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

-- 4. ポリシーの確認
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('pricing_tiers', 'payments');
