-- 簡単な広告挿入テスト

-- 1. 最小限のデータで広告を挿入
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
    '00000000-0000-0000-0000-000000000000',
    false
);

-- 2. 挿入されたデータを確認
SELECT 
    id,
    title,
    company,
    category,
    is_published,
    created_at
FROM ads 
WHERE title = 'テスト広告'
ORDER BY created_at DESC
LIMIT 1;

-- 3. テストデータを削除
DELETE FROM ads WHERE title = 'テスト広告';
