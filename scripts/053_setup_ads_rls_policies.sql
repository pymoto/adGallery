-- adsテーブルのRLSポリシーを設定

-- 1. 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view published ads" ON ads;
DROP POLICY IF EXISTS "Users can insert own ads" ON ads;
DROP POLICY IF EXISTS "Users can update own ads" ON ads;
DROP POLICY IF EXISTS "Users can delete own ads" ON ads;
DROP POLICY IF EXISTS "Admins can manage all ads" ON ads;
DROP POLICY IF EXISTS "Public can view published ads" ON ads;

-- 2. 新しいポリシーを作成

-- 公開済み広告は誰でも閲覧可能
CREATE POLICY "Public can view published ads" ON ads
    FOR SELECT USING (is_published = true);

-- 認証済みユーザーは自分の広告を挿入可能
CREATE POLICY "Users can insert own ads" ON ads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 認証済みユーザーは自分の広告を更新可能
CREATE POLICY "Users can update own ads" ON ads
    FOR UPDATE USING (auth.uid() = user_id);

-- 認証済みユーザーは自分の広告を削除可能
CREATE POLICY "Users can delete own ads" ON ads
    FOR DELETE USING (auth.uid() = user_id);

-- 管理者はすべての広告を管理可能
CREATE POLICY "Admins can manage all ads" ON ads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- 3. 結果確認
SELECT 
    polname AS policy_name,
    polcmd AS policy_command,
    pg_get_expr(polqual, polrelid) AS policy_condition
FROM pg_policy
WHERE polrelid = 'public.ads'::regclass;
