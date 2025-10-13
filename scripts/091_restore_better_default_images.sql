-- より良いデフォルト画像復元スクリプト
-- プレースホルダー画像をより適切なデフォルト画像に変更

-- 1. プレースホルダー画像をより良いデフォルト画像に変更
UPDATE ads 
SET image_url = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop&crop=center' 
WHERE image_url LIKE 'https://picsum.photos%';

-- 2. 変更結果を確認
SELECT 
  id, 
  title, 
  image_url, 
  created_at
FROM ads 
WHERE image_url LIKE 'https://images.unsplash.com%'
ORDER BY created_at DESC
LIMIT 5;
