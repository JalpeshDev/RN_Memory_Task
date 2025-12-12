import React, { memo, useMemo } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

const RootLayout = () => {
  const options = useMemo(
    () => ({
      headerShown: false,
    }),
    []
  );

  return (
    <>
      <StatusBar barStyle={"dark-content"} />
      <Stack screenOptions={options} />
    </>
  );
};

export default memo(RootLayout);
