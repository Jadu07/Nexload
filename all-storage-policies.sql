-- Allow public downloads
CREATE POLICY "Allow public downloads"
ON storage.objects FOR SELECT
USING (bucket_id = 'resources');

-- Allow authenticated uploads
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'resources' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated updates
CREATE POLICY "Allow authenticated updates"
ON storage.objects FOR UPDATE
USING (
    bucket_id = 'resources' 
    AND auth.role() = 'authenticated'
);

-- Allow authenticated deletes
CREATE POLICY "Allow authenticated deletes"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'resources' 
    AND auth.role() = 'authenticated'
);