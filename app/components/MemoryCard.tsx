import React, { memo, useMemo } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { spacing } from "../constants/spacing";
import { typography } from "../constants/typography";
import { colors } from "../constants/colors";
import CachedImage from "./CachedImage";

type Props = {
  title: string;
  description: string;
  imageUrl: string | null;
  date: string;
};

const MemoryCard = ({ title, description, imageUrl, date }: Props) => {
  const containerStyle = useMemo(() => styles.container, []);
  const imageStyle = useMemo(() => styles.image, []);
  const titleStyle = useMemo(() => styles.title, []);
  const descStyle = useMemo(() => styles.desc, []);
  const dateStyle = useMemo(() => styles.date, []);

  return (
    <View style={containerStyle}>
      {imageUrl ? (
        <CachedImage source={{ uri: imageUrl }} style={imageStyle} />
      ) : null}

      <Text style={titleStyle}>{title}</Text>
      <Text style={descStyle}>{description}</Text>
    </View>
  );
};

export default memo(MemoryCard);

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  image: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: typography.subheading,
    fontWeight: typography.weightBold,
    color: colors.textPrimary,
  },
  desc: {
    fontSize: typography.body,
    color: colors.textSecondary,
    marginTop: 4,
  },
  date: {
    fontSize: typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
});
