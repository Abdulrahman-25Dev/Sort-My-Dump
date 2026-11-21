// @ts-ignore: CSS modules are handled by Expo at runtime.
import "./global.css";
import { useEffect } from "react";
import { useColorScheme } from "nativewind";
import { Stack } from "expo-router";
import { useAppStore } from "../store/useAppStore";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  const { theme } = useAppStore();
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(theme);
  }, [setColorScheme, theme]);

  return (
    <SafeAreaProvider>
      <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_left', // تأثير انزلاق من اليسار (مناسب للعربية)
        contentStyle: { backgroundColor: theme === 'dark' ? '#111827' : '#f9fafb' }
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="settings" />
      <Stack.Screen name="History" />
    </Stack>
    </SafeAreaProvider>
  );
}
