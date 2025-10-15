-- ステージング環境のlikesテーブルポリシーを修正するスクリプト

-- 1. 既存ポリシーの確認
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'likes';

-- 2. 既存ポリシーの削除
DROP POLICY IF EXISTS "Users can manage their own likes" ON public.likes;
DROP POLICY IF EXISTS "Likes are viewable by everyone" ON public.likes;

-- 3. 新しいポリシーの作成
CREATE POLICY "Users can manage their own likes" ON public.likes
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Likes are viewable by everyone" ON public.likes
    FOR SELECT USING (true);

-- 4. ポリシーの確認
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'likes';
