/**
 * MemoriesScreen
 * -------------------
 * Responsible for listing all saved memories.
 *
 * Features:
 *  - FlatList for performance
 *  - getItemLayout for smooth scroll performance
 *  - MemoryCard is used to display each memory
 *  - Includes proper empty + loading states
 */

import React, { memo, useCallback, useMemo } from "react";
import { FlatList, StyleSheet, Text, View, ListRenderItem } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import MemoryCard from "app/components/MemoryCard";
import useFetchMemories from "app/hooks/useFetchMemories";
import { colors } from "app/constants/colors";
import { spacing } from "app/constants/spacing";
import { typography } from "app/constants/typography";
import { StoredMemory } from "app/types/memory";
import BackButton from "app/components/BackButton";

// Fixed height enables performant getItemLayout
const ITEM_HEIGHT = 260;

const MemoriesScreen = () => {
  const { data, loading } = useFetchMemories();

  // Memoized container styles avoid re-renders
  const containerStyle = useMemo(() => styles.container, []);

  /**
   * Render each MemoryCard.
   * Key extracts id from memory row.
   */
  const renderItem = useCallback<ListRenderItem<StoredMemory>>(
    ({ item }) => (
      <MemoryCard
        title={item.title}
        description={item.description || ""}
        imageUrl={item.image_url}
        date={item.created_at}
      />
    ),
    []
  );

  const keyExtractor = useCallback((item: StoredMemory) => item.id, []);

  /**
   * Provides height + offset to FlatList
   * for smooth scrolling without measuring cost.
   */
  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    []
  );

  const ListEmpty = useMemo(
    () => (
      <Text style={styles.empty}>
        {loading ? "Loading..." : "No memories found."}
      </Text>
    ),
    [loading]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <BackButton />
        <Text style={styles.title}>Saved Memories</Text>
      </View>
      <View style={containerStyle}>
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          ListEmptyComponent={ListEmpty}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          getItemLayout={getItemLayout}
        />
      </View>
    </SafeAreaView>
  );
};

export default memo(MemoriesScreen);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    padding: spacing.xl,
  },

  // Page heading
  title: {
    fontSize: typography.heading,
    fontWeight: typography.weightBold,
    color: colors.textPrimary,
    marginBottom: spacing.lg,
    marginLeft: 8,
  },

  listContent: {
    paddingBottom: spacing.xl,
  },

  empty: {
    color: colors.textSecondary,
    fontSize: typography.body,
    marginTop: spacing.lg,
    textAlign: "center",
  },
});
