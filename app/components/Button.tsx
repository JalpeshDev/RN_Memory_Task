import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";

import { colors } from "../constants/colors";
import { spacing } from "../constants/spacing";
import { typography } from "../constants/typography";
import { memo } from "react";

type ButtonProps = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
};

const Button = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  style,
}: ButtonProps) => {
  const isDisabled = useMemo(() => disabled || loading, [disabled, loading]);

  const handlePress = useCallback(() => {
    if (!isDisabled) onPress();
  }, [isDisabled, onPress]);

  const pressableStyle = useCallback(
    (pressed: boolean) => [
      styles.button,
      pressed && !isDisabled && styles.buttonPressed,
      isDisabled && styles.buttonDisabled,
      style,
    ],
    [isDisabled, style]
  );

  const textContent = useMemo(() => {
    return loading ? (
      <ActivityIndicator color={colors.card} />
    ) : (
      <Text style={styles.text}>{title}</Text>
    );
  }, [loading, title]);

  return (
    <Pressable
      style={({ pressed }) => pressableStyle(pressed)}
      onPress={handlePress}
      disabled={isDisabled}
    >
      {textContent}
    </Pressable>
  );
};

export default memo(Button);

const styles = StyleSheet.create({
  button: {
    width: "100%",
    backgroundColor: colors.blue500,
    paddingVertical: spacing.md,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    backgroundColor: colors.blue600,
  },
  buttonDisabled: {
    backgroundColor: colors.border,
  },
  text: {
    color: colors.card,
    fontSize: typography.button,
    fontWeight: typography.weightBold,
  },
});
