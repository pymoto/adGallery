-- 段階的なデータベース最適化スクリプト
-- 1つずつ実行して確認

-- ステップ1: 統計情報を更新
ANALYZE ads;
ANALYZE likes;
ANALYZE favorites;

-- ステップ2: 基本的なインデックスを作成
CREATE INDEX IF NOT EXISTS idx_ads_published_created_at 
ON ads (is_published, created_at DESC) 
WHERE is_published = true;

-- ステップ3: 最終的な統計更新
ANALYZE;
