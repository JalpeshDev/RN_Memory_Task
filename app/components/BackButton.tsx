import React, { memo, useCallback, useMemo } from "react";
import { Pressable, StyleSheet, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { colors } from "app/constants/colors";
import { spacing } from "app/constants/spacing";

/**
 * Reusable back navigation button.
 * Uses expo-router's router.back() and works across all screens consistently.
 */
type Props = {
  style?: ViewStyle;
  iconSize?: number;
  iconColor?: string;
};

const BackButton: React.FC<Props> = ({
  style,
  iconSize = 28,
  iconColor = colors.textPrimary,
}) => {
  const router = useRouter();

  const handlePress = useCallback(() => {
    router.back();
  }, [router]);

  const containerStyle = useMemo(
    () => [styles.buttonContainer, style],
    [style]
  );

  return (
    <Pressable
      onPress={handlePress}
      style={({ pressed }) => [containerStyle, pressed && styles.pressed]}
      accessibilityLabel="Go back"
    >
      <Ionicons name="chevron-back" size={iconSize} color={iconColor} />
    </Pressable>
  );
};

export default memo(BackButton);

const styles = StyleSheet.create({
  buttonContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
    marginLeft: 16,
  },
  pressed: {
    opacity: 0.7,
  },
});
