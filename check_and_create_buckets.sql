-- First, let's check existing buckets
SELECT id, name, public 
FROM storage.buckets;

-- Then, create only if not exists
INSERT INTO storage.buckets (id, name, public)
SELECT 'covers', 'covers', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'covers');

INSERT INTO storage.buckets (id, name, public)
SELECT 'resources', 'resources', true
WHERE NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'resources');