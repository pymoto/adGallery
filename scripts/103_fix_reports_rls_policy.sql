-- reportsテーブルのRLSポリシーを修正するスクリプト
-- 管理者がreportsテーブルを更新できるようにする

-- 1. 既存のRLSポリシーを削除
DROP POLICY IF EXISTS "Admin full access" ON reports;
DROP POLICY IF EXISTS "Users can view reports" ON reports;
DROP POLICY IF EXISTS "Users can insert reports" ON reports;
DROP POLICY IF EXISTS "Users can update reports" ON reports;

-- 2. 管理者用の包括的なRLSポリシーを作成
CREATE POLICY "Admin full access to reports" ON reports
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- 3. 一般ユーザー用のポリシーを作成
CREATE POLICY "Users can view their own reports" ON reports
FOR SELECT
TO authenticated
USING (reporter_id = auth.uid());

CREATE POLICY "Users can insert reports" ON reports
FOR INSERT
TO authenticated
WITH CHECK (reporter_id = auth.uid());

-- 4. 現在のRLS設定を確認
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'reports';

-- 5. 現在のポリシーを確認
SELECT 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check
FROM pg_policies 
WHERE tablename = 'reports';
