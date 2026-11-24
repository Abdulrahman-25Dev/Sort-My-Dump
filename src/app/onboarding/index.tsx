import { router } from "expo-router";
import { ArrowLeft, ArrowRight, Brain, Check, Sparkles } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../../store/useAppStore";

export default function OnboardingWelcomeScreen() {
  const { t } = useTranslation();
  const { theme, language } = useAppStore();
  const isArabic = language === "ar";
  const iconColor = theme === "dark" ? "#22D3C5" : "#0F766E";
  const ContinueIcon = isArabic ? ArrowLeft : ArrowRight;

  return (
    <SafeAreaView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <View className="flex-1 justify-between px-6 pb-8 pt-10">
        <View className="items-center">
          <View className="mb-8 h-24 w-24 items-center justify-center rounded-[28px] border border-amber-400/30 bg-amber-400/10">
            <Brain size={48} color="#F59E0B" strokeWidth={1.7} />
            <View className="absolute -right-2 -top-2 rounded-full bg-card-light p-2 dark:bg-card-dark">
              <Sparkles size={18} color={iconColor} />
            </View>
          </View>

          <Text className="text-center text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
            {t("onboarding.welcomeTitle")}
          </Text>
          <Text className="mt-3 text-center text-base leading-7 text-zinc-600 dark:text-zinc-400">
            {t("onboarding.welcomeDescription")}
          </Text>
        </View>

        <View className="gap-3 rounded-3xl border border-surface-light bg-card-light p-5 dark:border-surface-dark dark:bg-card-dark">
          {(["organize", "prioritize", "focus"] as const).map((item) => (
            <View
              key={item}
              className={`${isArabic ? "flex-row" : "flex-row-reverse"} items-center gap-3`}
            >
              <View className="h-8 w-8 items-center justify-center rounded-full bg-primary-light/10 dark:bg-primary-dark/10">
                <Check size={17} color={iconColor} strokeWidth={2.5} />
              </View>
              <Text
                className={`flex-1 ${isArabic ? "text-right" : "text-left"} text-sm font-medium text-zinc-700 dark:text-zinc-300`}
              >
                {t(`onboarding.${item}`)}
              </Text>
            </View>
          ))}
        </View>

        <View>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.push("/onboarding/setup")}
            className={`${isArabic ? "flex-row-reverse" : "flex-row"} h-14 items-center justify-center gap-2 rounded-2xl bg-primary-light px-5 dark:bg-primary-dark`}
          >
            <Text className="text-base font-bold text-white dark:text-zinc-950">
              {t("onboarding.getStarted")}
            </Text>
            <ContinueIcon size={19} color={theme === "dark" ? "#09090B" : "#FFFFFF"} />
          </TouchableOpacity>
          <Text className="mt-4 text-center text-xs text-zinc-500 dark:text-zinc-500">
            {t("onboarding.tagline")}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
