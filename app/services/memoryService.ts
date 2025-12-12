// Generates UUIDs for unique filenames in storage
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

// Using legacy FileSystem API because Expo SDK 50+ deprecated modern API on Android
import * as FileSystem from "expo-file-system/legacy";

import supabase from "./supabaseClient";
import api from "./api"; // Axios instance for consistent baseURL + headers
import constant from "app/constants/constant";

// Supabase storage bucket name for images
const BUCKET = "memories";

// Supabase base URL comes from env/constants
const SUPABASE_URL = constant.supabase.url;
console.log("supabase url", SUPABASE_URL);

/**
 * Upload selected image to Supabase Storage.
 * Axios is used (via api instance) for more stable multipart uploads on Android.
 *
 * @param localUri — file:// URI provided by Expo ImagePicker
 * @returns publicUrl (viewable image) + storagePath (file name)
 */
export async function uploadImageToStorage(localUri: string) {
  try {
    if (!localUri) throw new Error("No image selected");

    // Confirm file exists locally before uploading
    const info = await FileSystem.getInfoAsync(localUri);
    if (!info.exists) throw new Error("Selected file does not exist");

    // Determine extension & generate unique filename
    const ext = localUri.split(".").pop() ?? "jpg";
    const filename = `${uuidv4()}.${ext}`;
    const uploadPath = filename;

    // Supabase Storage upload endpoint (no /public when uploading)
    const uploadUrl = `/storage/v1/object/${BUCKET}/${uploadPath}`;

    // Build multipart/form-data body
    const form = new FormData();
    form.append("file", {
      uri: localUri,
      name: filename,
      type: `image/${ext}`,
    } as any);

    /**
     * Upload using Axios.
     * Axios handles boundaries automatically and is more stable
     * on Android vs fetch(FormData) for large images.
     */
    const response = await api.post(uploadUrl, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    // Supabase returns 200 or 201 for successful upload
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Upload failed");
    }

    // Public URL (bucket must be configured as public in Supabase)
    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${uploadPath}`;

    return { publicUrl, storagePath: uploadPath };
  } catch (err: any) {
    console.log("UPLOAD ERROR:", err);
    throw new Error(err?.message || "Image upload failed");
  }
}

/**
 * Insert new memory into Supabase Database.
 * This handles saving metadata after the image successfully uploads.
 */
export async function createMemoryRow({
  title,
  description,
  image_url,
}: {
  title: string;
  description?: string;
  image_url: string;
}) {
  try {
    const { data, error } = await supabase
      .from("memories")
      .insert({
        title,
        description: description ?? null,
        image_url,
      })
      .select()
      .single(); // return only inserted row

    if (error) throw error;

    return data;
  } catch (err: any) {
    console.log("DB INSERT ERROR:", err);
    throw new Error(err?.message || "Failed to save memory");
  }
}

export default {
  uploadImageToStorage,
  createMemoryRow,
};
