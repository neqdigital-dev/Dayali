-- Create a bucket for event media if it doesn't exist
INSERT INTO storage.buckets (id, name, public) VALUES ('event_media', 'event_media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to event media
CREATE POLICY "Event media is publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'event_media' );

-- Allow authenticated users to upload event media
CREATE POLICY "Users can upload event media."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'event_media' AND auth.role() = 'authenticated' );

-- Allow authenticated users to update event media
CREATE POLICY "Users can update event media."
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'event_media' AND auth.role() = 'authenticated' );

-- Allow authenticated users to delete event media
CREATE POLICY "Users can delete event media."
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'event_media' AND auth.role() = 'authenticated' );
