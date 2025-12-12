/**
 * Hook responsible for orchestrating:
 * 1. validation
 * 2. image upload
 * 3. db insert
 * 4. loading + error state
 */

import { useCallback, useState } from "react";
import memoryService from "../services/memoryService";

type UploadParams = {
  title: string;
  description?: string;
  imageUri: string | null;
};

const useUploadMemory = () => {
  // UI loading state for submit button
  const [loading, setLoading] = useState(false);

  // Error shown below the button
  const [error, setError] = useState<string | null>(null);

  /**
   * Main upload handler called from UI screens.
   * Returns inserted memory row when successful.
   */
  const upload = useCallback(async (params: UploadParams) => {
    setLoading(true);
    setError(null);

    try {
      const { title, description, imageUri } = params;

      // Basic client-side validation
      if (!imageUri) throw new Error("Please select an image.");
      if (!title || title.trim().length === 0)
        throw new Error("Please add a title.");

      // Upload image → returns public URL
      const { publicUrl } = await memoryService.uploadImageToStorage(imageUri);

      // Save memory metadata in database
      const created = await memoryService.createMemoryRow({
        title: title.trim(),
        description: description ?? "",
        image_url: publicUrl,
      });

      setLoading(false);
      return { success: true, data: created };
    } catch (err: any) {
      setError(err?.message ?? "Upload failed");
      setLoading(false);
      throw err; // allow UI-level handling (like navigation)
    }
  }, []);

  return { upload, loading, error };
};

export default useUploadMemory;
