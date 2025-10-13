-- is_publishedカラムのNOT NULL制約を削除
-- これにより、null（非公開）、false（承認待ち）、true（公開）の3つの状態を管理できる

-- 既存のNOT NULL制約を削除
ALTER TABLE public.ads ALTER COLUMN is_published DROP NOT NULL;

-- 制約が削除されたことを確認
SELECT column_name, is_nullable, data_type 
FROM information_schema.columns 
WHERE table_name = 'ads' AND column_name = 'is_published';
