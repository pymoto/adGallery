-- 超安全なデータベース最適化スクリプト
-- 最小限の操作のみを実行

-- 1. 基本的な統計情報を更新
ANALYZE ads;

-- 2. 基本的なインデックスを作成（存在しない場合のみ）
CREATE INDEX IF NOT EXISTS idx_ads_published_created_at 
ON ads (is_published, created_at DESC) 
WHERE is_published = true;

-- 3. 最終的な統計更新
ANALYZE;
