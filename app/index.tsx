import React, { memo, useCallback, useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import GradientView from "./components/GradientView";
import { colors } from "./constants/colors";
import { spacing } from "./constants/spacing";
import { typography } from "./constants/typography";

const HomeScreen = () => {
  const router = useRouter();

  /**
   * Navigates to Create Memory screen.
   * useCallback prevents re-renders when passed into Pressable.
   */
  const handleCreateMemory = useCallback(() => {
    router.push("/create");
  }, [router]);

  /**
   * Navigates to Memories listing screen.
   */
  const handleViewMemories = useCallback(() => {
    router.push("/memories");
  }, [router]);

  /**
   * Memoized styles to avoid re-calculation on each render.
   */
  const containerStyle = useMemo(() => styles.container, []);
  const titleStyle = useMemo(() => styles.title, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top header section with decorative gradient background */}
      <View style={styles.headerWrapper}>
        <GradientView
          colors={[colors.blue500, colors.blue600]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          {/* Light circular decoration on gradient */}
          <View style={styles.decorCircle} />

          {/* Icon illustration in the header */}
          <View style={styles.iconContainer}>
            <View style={styles.iconWrapper}>
              <Ionicons name="albums" size={48} color={colors.blue500} />
            </View>
          </View>
        </GradientView>
      </View>

      {/* Main content area */}
      <View style={containerStyle}>
        {/* Page Title */}
        <Text style={titleStyle}>Your Memories</Text>

        <Text style={styles.subtitle}>
          Create and add the memories you want to remember.
        </Text>

        {/* Buttons Section */}
        <View style={styles.buttonGroup}>
          {/* Create Memory CTA */}
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
            onPress={handleCreateMemory}
          >
            <Text style={styles.buttonText}>Create Memory</Text>
          </Pressable>

          {/* View Memories CTA */}
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
            onPress={handleViewMemories}
          >
            <Text style={styles.buttonText}>View Memories</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default memo(HomeScreen);

// ---------------------- STYLES ----------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  // Gradient header container
  headerWrapper: {
    height: 280,
    width: "100%",
    overflow: "hidden",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },

  // Main gradient background used in header
  headerGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    paddingTop: 40,
  },

  // Decorative translucent circle on top-right
  decorCircle: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    top: -60,
    right: -40,
  },

  // Icon section (albums icon)
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  // White circular icon wrapper card
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.card,
    justifyContent: "center",
    alignItems: "center",

    // Subtle shadow for elevation effect
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // Main content container
  container: {
    flex: 1,
    padding: spacing.xl,
    paddingTop: spacing.xxl,
    alignItems: "center",
    gap: spacing.lg,
    backgroundColor: colors.background,
  },

  // Main title styling
  title: {
    fontSize: typography.heading + 8,
    fontWeight: typography.weightBold,
    textAlign: "center",
    color: colors.textPrimary,
  },

  subtitle: {
    fontSize: typography.subheading,
    textAlign: "center",
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    lineHeight: 24,
  },

  // Button container
  buttonGroup: {
    width: "100%",
    gap: spacing.md,
    marginTop: spacing.md,
  },

  // Main action button
  primaryButton: {
    width: "100%",
    backgroundColor: colors.blue500,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  // Pressed state for button
  primaryButtonPressed: {
    backgroundColor: colors.blue600,
  },

  // Button text
  buttonText: {
    color: colors.white,
    fontSize: typography.button,
    fontWeight: typography.weightBold,
  },
});
