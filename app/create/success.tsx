/**
 * SuccessScreen
 * -------------------
 * Shown immediately after a memory is uploaded.
 * Displays:
 *  - Success animation
 *  - Uploaded image preview
 *  - Back to home button
 *
 * router.dismissAll() + router.replace("/") ensures that:
 *  - User cannot navigate back to CreateMemoryScreen
 *  - Navigation stack resets properly
 */

import React, { memo, useCallback, useMemo } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";

import Button from "app/components/Button";
import { colors } from "app/constants/colors";
import { spacing } from "app/constants/spacing";
import { typography } from "app/constants/typography";
import images from "../assets/images";
import CachedImage from "app/components/CachedImage";
import lottie from "../../assets/lottie";

const SuccessScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const imageUrl = (params?.imageUrl as string) ?? null;

  /**
   * Navigate home without leaving this page in history.
   * Prevents user from returning to success screen via back button.
   */
  const handleBack = useCallback(() => {
    router.dismissAll(); // clears navigation stack
    router.replace("/"); // sends user to home
  }, [router]);

  // Show uploaded image or fallback placeholder
  const imageSource = useMemo(
    () => (imageUrl ? { uri: imageUrl } : images.placeholder),
    [imageUrl]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Success Animation */}
          <LottieView
            source={lottie.success}
            autoPlay
            loop={false}
            style={styles.animation}
          />

          <Text style={styles.title}>Memory created successfully!</Text>
          <Text style={styles.subtitle}>
            You can always find this memory in your collection.
          </Text>

          <CachedImage
            source={imageSource}
            style={styles.image}
            resizeMode="cover"
          />

          <Button title="Back to Home" onPress={handleBack} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default memo(SuccessScreen);

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },

  container: {
    flex: 1,
    padding: spacing.xl,
    alignItems: "center",
    gap: spacing.lg,
  },

  animation: {
    width: 100,
    height: 100,
  },

  title: {
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    color: colors.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    fontSize: typography.subheading,
    color: colors.textSecondary,
    textAlign: "center",
  },

  image: {
    width: "100%",
    height: 360,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
