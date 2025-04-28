-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('covers', 'covers', true),
  ('resources', 'resources', true);