-- カテゴリ別デフォルト画像復元スクリプト
-- カテゴリに応じた適切なデフォルト画像を設定

-- 1. テクノロジーカテゴリの画像
UPDATE ads 
SET image_url = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center' 
WHERE image_url LIKE 'https://picsum.photos%' 
AND category = 'tech';

-- 2. ファッションカテゴリの画像
UPDATE ads 
SET image_url = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center' 
WHERE image_url LIKE 'https://picsum.photos%' 
AND category = 'fashion';

-- 3. その他のカテゴリの画像
UPDATE ads 
SET image_url = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center' 
WHERE image_url LIKE 'https://picsum.photos%' 
AND category NOT IN ('tech', 'fashion');

-- 4. 変更結果を確認
SELECT 
  id, 
  title, 
  category,
  image_url, 
  created_at
FROM ads 
WHERE image_url LIKE 'https://images.unsplash.com%'
ORDER BY created_at DESC
LIMIT 10;
