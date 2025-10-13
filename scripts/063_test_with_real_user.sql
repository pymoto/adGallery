-- 実際のユーザーIDを使用してテスト

-- 1. 認証済みユーザーを確認
SELECT 
    auth.uid() AS current_user_id,
    auth.email() AS current_user_email;

-- 2. 認証済みユーザーがいる場合、そのIDでテスト
-- 認証されていない場合は、既存のユーザーIDを使用
SELECT 
    id,
    email,
    created_at
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. 既存のユーザーIDでテスト挿入
-- 注意: 実際のユーザーIDに置き換えてください
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
    'https://example.com/image.jpg',
    'テスト用の広告です',
    (SELECT id FROM auth.users LIMIT 1), -- 最初のユーザーIDを使用
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
