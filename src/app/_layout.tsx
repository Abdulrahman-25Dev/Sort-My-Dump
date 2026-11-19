// @ts-ignore: CSS modules are handled by Expo at runtime.
import "./global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
  <Stack>
    <Stack.Screen name="index" options={{ headerShown: false }} />
  </Stack>
  );
}
