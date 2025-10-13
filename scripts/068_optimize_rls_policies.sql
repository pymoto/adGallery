-- RLSポリシーを最適化

-- 1. すべてのRLSポリシーを削除
DROP POLICY IF EXISTS "Public can view published ads" ON ads;
DROP POLICY IF EXISTS "Users can insert own ads" ON ads;
DROP POLICY IF EXISTS "Users can update own ads" ON ads;
DROP POLICY IF EXISTS "Users can delete own ads" ON ads;
DROP POLICY IF EXISTS "Admins can manage all ads" ON ads;

-- 2. RLSを一時的に無効化
ALTER TABLE ads DISABLE ROW LEVEL SECURITY;

-- 3. テスト用の簡単な挿入
INSERT INTO ads (
    title,
    company,
    category,
    image_url,
    description,
    user_id,
    is_published
) VALUES (
    'テスト広告',
    'テスト会社',
    'tech',
    'https://picsum.photos/400/300?random=1',
    'データベーステスト用の広告です',
    (SELECT id FROM auth.users LIMIT 1),
    false
);

-- 4. 挿入されたデータを確認
SELECT 
    id,
    title,
    company,
    category,
    is_published,
    user_id,
    created_at
FROM ads 
WHERE title = 'テスト広告'
ORDER BY created_at DESC
LIMIT 1;

-- 5. テストデータを削除
DELETE FROM ads WHERE title = 'テスト広告';

-- 6. RLSを再有効化
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;

-- 7. 最適化されたポリシーを作成
CREATE POLICY "Public can view published ads" ON ads
    FOR SELECT USING (is_published = true);

CREATE POLICY "Users can insert own ads" ON ads
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ads" ON ads
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ads" ON ads
    FOR DELETE USING (auth.uid() = user_id);

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
