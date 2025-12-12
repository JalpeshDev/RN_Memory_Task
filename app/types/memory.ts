export interface Memory {
  title: string;
  description: string;
  imageUri: string | null;
}

export interface StoredMemory {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}
