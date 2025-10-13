-- データベース状況確認スクリプト
-- 現在のテーブル状況とデータ量を確認

-- 1. 存在するテーブルを確認
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2. adsテーブルのデータ数を確認
SELECT COUNT(*) as total_ads FROM ads;
SELECT COUNT(*) as published_ads FROM ads WHERE is_published = true;

-- 3. likesテーブルのデータ数を確認
SELECT COUNT(*) as total_likes FROM likes;

-- 4. favoritesテーブルのデータ数を確認
SELECT COUNT(*) as total_favorites FROM favorites;

-- 5. 現在のインデックス状況を確認
SELECT indexname, tablename, indexdef 
FROM pg_indexes 
WHERE tablename IN ('ads', 'likes', 'favorites')
ORDER BY tablename, indexname;
