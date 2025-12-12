/**
 * GradientView
 * -----------------------------------------
 * A safe gradient wrapper that avoids the native
 * "Unimplemented component" crash caused by expo-linear-gradient
 * when the app isn't rebuilt after installation.
 *
 * This fallback simulates a gradient by using a solid background
 * + a semi-transparent overlay to mimic the direction of the gradient.
 *
 * This ensures:
 *  - No native crashes
 *  - Lightweight + rendering safe in Expo Go
 *  - Consistent usage anywhere in the app
 */

import React, { memo } from "react";
import { View, ViewStyle, StyleSheet } from "react-native";

export type GradientViewProps = {
  colors: string[]; // [primary, secondary]
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle;
  children?: React.ReactNode;
};

const GradientView: React.FC<GradientViewProps> = ({
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  children,
}) => {
  // Primary base fill
  const primaryColor = colors[0] ?? "#6366F1";

  // Second color used for overlay simulation
  const secondaryColor = colors[1] ?? primaryColor;

  // Derive overlay shape from gradient direction
  const isHorizontal = end.x > start.x;

  const overlayPosition: ViewStyle = isHorizontal
    ? { left: "50%", right: 0, top: 0, bottom: 0 }
    : { top: "50%", bottom: 0, left: 0, right: 0 };

  return (
    <View style={[styles.base, { backgroundColor: primaryColor }, style]}>
      {/* Overlay to simulate gradient fade */}
      {colors.length > 1 && (
        <View
          style={[
            styles.overlay,
            overlayPosition,
            {
              backgroundColor: secondaryColor,
              borderRadius: (style as any)?.borderRadius || 0,
            },
          ]}
        />
      )}

      {/* Normal children layer */}
      <View style={styles.content}>{children}</View>
    </View>
  );
};

export default memo(GradientView);

const styles = StyleSheet.create({
  base: {
    position: "relative",
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    opacity: 0.35, // slightly softer for premium UI
  },
  content: {
    position: "relative",
    zIndex: 1,
  },
});
