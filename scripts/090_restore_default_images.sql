-- デフォルト画像復元スクリプト
-- プレースホルダー画像を適切なデフォルト画像に変更

-- 1. プレースホルダー画像をデフォルト画像に変更
UPDATE ads 
SET image_url = 'https://via.placeholder.com/400x300/cccccc/666666?text=No+Image' 
WHERE image_url LIKE 'https://picsum.photos%';

-- 2. 変更結果を確認
SELECT 
  id, 
  title, 
  image_url, 
  created_at
FROM ads 
WHERE image_url LIKE 'https://via.placeholder.com%'
ORDER BY created_at DESC
LIMIT 5;
