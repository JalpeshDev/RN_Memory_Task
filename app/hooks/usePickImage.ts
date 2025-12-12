import { useCallback, useMemo, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";

const usePickImage = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = useCallback(async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: false,
    });

    if (result.canceled) return;

    const asset = result.assets?.[0];
    if (!asset?.uri) return;

    // FORCE a real file path using ImageManipulator
    const manipulated = await ImageManipulator.manipulateAsync(
      asset.uri,
      [{ resize: { width: 1400 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    // manipulated.uri is always a valid file://path
    setImageUri(manipulated.uri);
  }, []);

  return useMemo(() => ({ imageUri, pickImage }), [imageUri, pickImage]);
};

export default usePickImage;
