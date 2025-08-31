-- Add new columns to article table
ALTER TABLE article 
ADD COLUMN summary TEXT,
ADD COLUMN image_url VARCHAR(500);
