// @ts-ignore: CSS modules are handled by Expo at runtime.
import "./global.css";
import { useEffect, useState } from "react";
import { Platform } from "react-native";
import { useColorScheme } from "nativewind";
import { router, Stack, usePathname } from "expo-router";
import { useAppStore } from "../store/useAppStore";
import i18n from "../I18n/i18next";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { CustomSplash } from "../components/CustomSplash";
import { CustomAlertProvider } from "../components/CustomAlert";

export default function RootLayout() {
  const { theme, language, isOnboardingCompleted, hydrate } = useAppStore();
  const { setColorScheme } = useColorScheme();
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (Platform.OS !== "web" || typeof window !== "undefined") {
      hydrate();
    }
  }, [hydrate]);

  useEffect(() => {
    setColorScheme(theme);
  }, [setColorScheme, theme]);

  useEffect(() => {
    void i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    if (!isReady) return;

    const isOnboardingRoute = pathname.startsWith("/onboarding");
    if (!isOnboardingCompleted && !isOnboardingRoute) {
      router.replace("/onboarding");
    } else if (isOnboardingCompleted && isOnboardingRoute) {
      router.replace("/");
    }
  }, [isOnboardingCompleted, isReady, pathname]);

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <CustomAlertProvider>
          {/* شاشة البداية المخصصة تظهر فوق كل شيء حتى تنتهي */}
          {!isReady && <CustomSplash onFinish={() => setIsReady(true)} />}

          {/* باقي الشاشات لا تظهر إلا بعد انتهاء السبلاش */}
          {isReady && (
            <Stack
              screenOptions={{
                headerShown: false,
                animation: "slide_from_left",
                contentStyle: {
                  backgroundColor: theme === "dark" ? "#0F1412" : "#F5F7F5",
                },
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="settings" />
              <Stack.Screen name="History" />
              <Stack.Screen name="onboarding/index" />
              <Stack.Screen name="onboarding/setup" />
            </Stack>
          )}
        </CustomAlertProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}