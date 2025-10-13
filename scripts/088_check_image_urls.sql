-- 画像URL状況確認スクリプト
-- 現在の画像URLの状況を詳しく確認

-- 1. プレースホルダー画像の数を確認
SELECT COUNT(*) as placeholder_count
FROM ads 
WHERE image_url LIKE 'https://picsum.photos%';

-- 2. 元の画像URLが残っているか確認
SELECT COUNT(*) as original_count
FROM ads 
WHERE image_url NOT LIKE 'https://picsum.photos%' 
AND image_url IS NOT NULL 
AND image_url != '';

-- 3. 画像URLの種類別カウント
SELECT 
  CASE 
    WHEN image_url LIKE 'https://picsum.photos%' THEN 'プレースホルダー'
    WHEN image_url LIKE 'data:image%' THEN 'Base64データ'
    WHEN image_url LIKE 'https://%' THEN '外部URL'
    WHEN image_url IS NULL OR image_url = '' THEN '空'
    ELSE 'その他'
  END as image_type,
  COUNT(*) as count
FROM ads 
GROUP BY 
  CASE 
    WHEN image_url LIKE 'https://picsum.photos%' THEN 'プレースホルダー'
    WHEN image_url LIKE 'data:image%' THEN 'Base64データ'
    WHEN image_url LIKE 'https://%' THEN '外部URL'
    WHEN image_url IS NULL OR image_url = '' THEN '空'
    ELSE 'その他'
  END;

-- 4. サンプルデータを表示
SELECT id, title, image_url, created_at
FROM ads 
ORDER BY created_at DESC
LIMIT 5;
