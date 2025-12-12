import React, { memo, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from "react-native";
import { colors } from "app/constants/colors";
import { spacing } from "app/constants/spacing";
import { typography } from "app/constants/typography";

type InputProps = TextInputProps & {
  label: string;
};

const Input: React.FC<InputProps> = ({ label, multiline, style, ...rest }) => {
  const inputStyle = useMemo(
    () => [styles.input, multiline && styles.multiline, style],
    [multiline, style]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={inputStyle}
        placeholderTextColor={colors.textSecondary}
        multiline={multiline}
        {...rest}
      />
    </View>
  );
};

export default memo(Input);

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: spacing.xs,
  },
  label: {
    fontSize: typography.body,
    fontWeight: typography.weightSemi,
    color: colors.textPrimary,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.card,
    color: colors.textPrimary,
    fontSize: typography.body,
  },
  multiline: {
    minHeight: 120,
    textAlignVertical: "top",
  },
});
