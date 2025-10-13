-- adsテーブルのRLSポリシーを作成

-- 1. 既存のポリシーを削除
DROP POLICY IF EXISTS "Users can view published ads" ON ads;
DROP POLICY IF EXISTS "Users can insert own ads" ON ads;
DROP POLICY IF EXISTS "Users can update own ads" ON ads;
DROP POLICY IF EXISTS "Users can delete own ads" ON ads;
DROP POLICY IF EXISTS "Admins can manage all ads" ON ads;

-- 2. RLSを有効化
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- 3. ユーザーは公開済み広告を閲覧できる
CREATE POLICY "Users can view published ads" ON ads
    FOR SELECT USING (is_published = true);

-- 4. ユーザーは自分の広告を挿入できる
CREATE POLICY "Users can insert own ads" ON ads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. ユーザーは自分の広告を更新できる
CREATE POLICY "Users can update own ads" ON ads
    FOR UPDATE USING (auth.uid() = user_id);

-- 6. ユーザーは自分の広告を削除できる
CREATE POLICY "Users can delete own ads" ON ads
    FOR DELETE USING (auth.uid() = user_id);

-- 7. 管理者はすべての広告を管理できる
CREATE POLICY "Admins can manage all ads" ON ads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() AND is_admin = true
        )
    );

-- 8. 結果確認
SELECT 
    polname AS policy_name,
    polcmd AS policy_command
FROM pg_policy
WHERE polrelid = 'public.ads'::regclass;
