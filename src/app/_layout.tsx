// @ts-ignore: CSS modules are handled by Expo at runtime.
import "./global.css";
import { useEffect, useState } from "react";
import { useColorScheme } from "nativewind";
import { Stack } from "expo-router";
import { useAppStore } from "../store/useAppStore";
import i18n from "../I18n/i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CustomSplash } from "../components/CustomSplash";

export default function RootLayout() {
  const { theme } = useAppStore();
  const { setColorScheme } = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setColorScheme(theme);
  }, [setColorScheme, theme]);

  useEffect(() => {
    void i18n.changeLanguage(useAppStore.getState().language);
  }, []);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* شاشة البداية المخصصة تظهر فوق كل شيء حتى تنتهي */}
        {!isReady && <CustomSplash onFinish={() => setIsReady(true)} />}
        
        {/* باقي الشاشات لا تظهر إلا بعد انتهاء السبلاش */}
        {isReady && (
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_left',
              contentStyle: { backgroundColor: theme === 'dark' ? '#18181B' : '#f9fafb' } // تم تحديث اللون الداكن ليتناسب مع الثيم الجديد
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="History" />
          </Stack>
        )}
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}