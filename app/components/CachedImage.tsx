/**
 * Custom cached image component using expo-image.
 * Adds:
 * 1. True shimmer effect until the image loads
 * 2. Local placeholder on error
 * 3. Smooth fade-in effect
 */

import React, { useState, useRef, useEffect, memo, useMemo } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  ImageSourcePropType,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import images from "app/assets/images";

interface CachedImageProps {
  source: any;
  style?: any;
  imgStyle?: any;
  placeholderImage?: ImageSourcePropType;
  placeHolderImageStyle?: any;
  children?: React.ReactNode;
  resizeMode?: any;
}

const CachedImage = ({
  source,
  style,
  imgStyle,
  placeholderImage,
  placeHolderImageStyle,
  children,
  ...rest
}: CachedImageProps) => {
  // Tracks whether main image finished loading
  const [loaded, setLoaded] = useState(false);

  // Whether load failed → fallback display
  const [error, setError] = useState(false);

  // Animated shimmer controller
  const shimmerAnim = useRef(new Animated.Value(-1)).current;

  /**
   * Infinite shimmer animation:
   * moves a gradient from left → right until the image loads.
   */
  useEffect(() => {
    if (!loaded && !error) {
      Animated.loop(
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [loaded, error]);

  // Animate shimmer horizontally
  const translateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-200, 200],
  });

  // Shimmer view memoized for performance
  const shimmer = useMemo(
    () => (
      <Animated.View
        style={[styles.shimmerWrapper, { transform: [{ translateX }] }]}
      >
        <LinearGradient
          colors={["#e5e7eb00", "#e5e7eb", "#e5e7eb00"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.shimmer}
        />
      </Animated.View>
    ),
    [translateX]
  );

  // Placeholder image if loading fails
  const fallback = useMemo(
    () => (
      <View style={styles.placeholderContainer}>
        <Image
          source={placeholderImage || images.placeholder}
          style={[styles.placeholderImage, placeHolderImageStyle]}
          contentFit="contain"
        />
      </View>
    ),
    [placeholderImage, placeHolderImageStyle]
  );

  return (
    <View style={[styles.container, style]}>
      <Image
        {...rest}
        source={source}
        style={[styles.image, imgStyle]}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        contentFit="cover"
      />

      {children}

      {/* Show shimmer until completely loaded */}
      {!loaded && !error && shimmer}

      {/* Show fallback when load fails */}
      {error && fallback}
    </View>
  );
};

export default memo(CachedImage);

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },

  shimmerWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  shimmer: {
    width: 200,
    height: "100%",
    opacity: 0.45,
  },

  placeholderContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderImage: {
    width: "60%",
    height: "60%",
    opacity: 0.5,
  },
});
