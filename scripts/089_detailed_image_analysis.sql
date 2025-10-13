-- 詳細な画像URL分析スクリプト
-- 復元可能な画像URLを特定

-- 1. プレースホルダー画像の詳細確認
SELECT 
  id, 
  title, 
  image_url, 
  created_at,
  LENGTH(image_url) as url_length
FROM ads 
WHERE image_url LIKE 'https://picsum.photos%'
ORDER BY created_at DESC
LIMIT 10;

-- 2. 元の画像URLが残っている広告を確認
SELECT 
  id, 
  title, 
  image_url, 
  created_at,
  LENGTH(image_url) as url_length
FROM ads 
WHERE image_url NOT LIKE 'https://picsum.photos%' 
AND image_url IS NOT NULL 
AND image_url != ''
ORDER BY created_at DESC
LIMIT 10;

-- 3. 画像URLの長さ分布を確認
SELECT 
  CASE 
    WHEN LENGTH(image_url) < 50 THEN '短いURL'
    WHEN LENGTH(image_url) < 200 THEN '中程度URL'
    WHEN LENGTH(image_url) < 1000 THEN '長いURL'
    ELSE '非常に長いURL'
  END as url_length_category,
  COUNT(*) as count
FROM ads 
WHERE image_url IS NOT NULL 
AND image_url != ''
GROUP BY 
  CASE 
    WHEN LENGTH(image_url) < 50 THEN '短いURL'
    WHEN LENGTH(image_url) < 200 THEN '中程度URL'
    WHEN LENGTH(image_url) < 1000 THEN '長いURL'
    ELSE '非常に長いURL'
  END;

-- 4. 最近作成された広告の画像URLを確認
SELECT 
  id, 
  title, 
  image_url, 
  created_at
FROM ads 
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC
LIMIT 5;
