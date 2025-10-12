-- 閲覧数を増加させるRPC関数を作成
CREATE OR REPLACE FUNCTION increment_views(ad_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.ads 
    SET views = views + 1 
    WHERE id = ad_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 関数の実行権限を設定
GRANT EXECUTE ON FUNCTION increment_views(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_views(UUID) TO anon;
