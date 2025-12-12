/**
 * CreateMemoryScreen
 * -------------------
 * This screen is responsible for:
 *  1. Previewing the selected image
 *  2. Collecting title + description input
 *  3. Uploading data using useUploadMemory hook
 *  4. Navigating to success screen
 *
 * UI includes:
 *  - Hero image preview with placeholder
 *  - Auto-updating title/description preview
 *  - Sticky footer button
 *  - Safe area + keyboard handling
 */

import React, { memo, useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { Image } from "expo-image";

import Input from "../components/Input";
import Button from "../components/Button";
import usePickImage from "../hooks/usePickImage";
import useUploadMemory from "../hooks/useUploadMemory";

import { colors } from "app/constants/colors";
import { spacing } from "app/constants/spacing";
import { typography } from "app/constants/typography";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackButton from "app/components/BackButton";

type Props = Record<string, never>;

const CreateMemoryScreen: React.FC<Props> = () => {
  const router = useRouter();
  const { imageUri, pickImage } = usePickImage(); // handles image picker flow
  const { upload, loading, error } = useUploadMemory(); // handles upload + DB insert

  // Controlled form fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Safe-area padding helps layout on devices with notches / gesture areas
  const { top, bottom } = useSafeAreaInsets();

  /**
   * Upload handler:
   * Calls useUploadMemory → navigates to success screen when done.
   */
  const handleUpload = useCallback(async () => {
    try {
      const created = await upload({ title, description, imageUri });
      const imageUrl = created?.data?.image_url ?? null;

      // replace prevents user from coming back to this screen
      router.replace({ pathname: "/create/success", params: { imageUrl } });
    } catch {}
  }, [upload, title, description, imageUri, router]);

  // Compute preview image source for hero component
  const previewSource = useMemo(
    () => (imageUri ? { uri: imageUri } : undefined),
    [imageUri]
  );

  return (
    <View style={styles.root}>
      {/* Safe-area padding around screen edges */}
      <View style={[styles.safeArea, { paddingTop: top }]}>
        <BackButton />
        <KeyboardAvoidingView style={styles.flex} behavior={"padding"}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.hero}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={pickImage}
                accessibilityLabel="Pick or change image"
              >
                {previewSource ? (
                  <Image
                    source={previewSource}
                    style={styles.heroImage}
                    contentFit="cover"
                  />
                ) : (
                  <View style={styles.heroPlaceholder}>
                    <Text style={styles.heroPlaceholderTitle}>
                      Add a memory
                    </Text>
                    <Text style={styles.heroPlaceholderSubtitle}>
                      Tap to pick a photo
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Auto-updating preview of text fields */}
              <View style={styles.heroMeta}>
                <Text style={styles.heroMetaTitle}>{title || "Title"}</Text>

                <Text style={styles.heroMetaSubtitle}>
                  {description ? description.slice(0, 60) : "Add a description"}
                </Text>
              </View>
            </View>

            {/* Details card with inputs */}
            <View style={styles.card}>
              <Text style={styles.cardHeading}>Memory details</Text>

              <Input
                label="Title"
                value={title}
                onChangeText={setTitle}
                placeholder="Family picnic"
              />

              <Input
                label="Description"
                value={description}
                onChangeText={setDescription}
                placeholder="Describe the memory..."
                multiline
              />

              {error ? <Text style={styles.error}>{error}</Text> : null}
            </View>

            {/* Screen-bottom padding for scroll + keyboard */}
            <View style={{ height: spacing.xxl }} />
          </ScrollView>

          {/* Sticky footer with Upload CTA */}
          <View style={styles.stickyFooter}>
            <Button
              title={loading ? "Uploading..." : "Save Memory"}
              onPress={handleUpload}
              disabled={loading}
              loading={loading}
              style={{ ...styles.ctaButton, marginBottom: bottom }}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default memo(CreateMemoryScreen);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.94)",
  },
  safeArea: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },

  scrollContent: {
    paddingBottom: 100,
  },

  /** HERO SECTION */
  hero: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.sm,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: colors.card,

    // soft drop shadow for premium effect
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  heroImage: {
    width: "100%",
    height: 260,
  },
  heroPlaceholder: {
    width: "100%",
    height: 260,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  heroPlaceholderTitle: {
    fontSize: typography.subheading,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  heroPlaceholderSubtitle: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginTop: 6,
  },

  heroMeta: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  heroMetaTitle: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  heroMetaSubtitle: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },

  /** DETAILS CARD */
  card: {
    marginHorizontal: spacing.xl,
    marginTop: spacing.md,
    padding: spacing.lg,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,

    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
    gap: spacing.md,
  },
  cardHeading: {
    fontSize: typography.body,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  /** FOOTER */
  stickyFooter: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: Math.max(spacing.md, 16),
    backgroundColor: "rgba(255,255,255,0.94)",
  },
  ctaButton: {
    borderRadius: 14,
    paddingVertical: spacing.md,
  },

  error: {
    color: "#DC2626",
    textAlign: "center",
  },
});
