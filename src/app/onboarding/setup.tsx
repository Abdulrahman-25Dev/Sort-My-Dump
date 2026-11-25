import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { ArrowLeft, ArrowRight, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppStore } from "../../store/useAppStore";
import { useCustomAlert } from "../../components/CustomAlert";

const DEFAULT_OPENROUTER_MODEL = "meta-llama/llama-3.2-3b-instruct:free";

export default function OnboardingSetupScreen() {
  const { t } = useTranslation();
  const { showAlert } = useCustomAlert();
  const {
    apiKey,
    setApiKey,
    setEnvironment,
    setModelName,
    completeOnboarding,
    theme,
    language,
  } = useAppStore();
  const [key, setKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const isArabic = language === "ar";
  const iconColor = theme === "dark" ? "#22D3C5" : "#0F766E";
  const BackIcon = isArabic ? ArrowRight : ArrowLeft;
  const ContinueIcon = isArabic ? ArrowLeft : ArrowRight;

  const handleSave = () => {
    const trimmedKey = key.trim();
    if (!trimmedKey) {
      showAlert({
        title: t("onboarding.alertTitle"),
        message: t("onboarding.enterKey"),
        variant: "error",
      });
      return;
    }

    setApiKey(trimmedKey);
    setEnvironment("prod");
    setModelName(DEFAULT_OPENROUTER_MODEL);
    completeOnboarding();
    router.replace("/");
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={t("onboarding.back")}
            onPress={() => router.back()}
            className="mb-10 mt-4 h-11 w-11 items-center justify-center rounded-full border border-surface-light bg-card-light dark:border-surface-dark dark:bg-card-dark"
          >
            <BackIcon size={20} color={theme === "dark" ? "#D4D4D8" : "#52525B"} />
          </TouchableOpacity>

          <View className="mb-8 h-16 w-16 items-center justify-center rounded-2xl bg-accent-light/10 dark:bg-accent-dark/10">
            <KeyRound size={30} color={iconColor} />
          </View>

          <Text
            className={`mb-3 text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 ${isArabic ? "text-right" : "text-left"}`}
          >
            {t("onboarding.setupTitle")}
          </Text>
          <Text
            className={`mb-8 text-base leading-7 text-zinc-600 dark:text-zinc-400 ${isArabic ? "text-right" : "text-left"}`}
          >
            {t("onboarding.setupDescription")}
          </Text>

          <Text
            className={`mb-2 text-sm font-bold text-zinc-800 dark:text-zinc-200 ${isArabic ? "text-right" : "text-left"}`}
          >
            {t("onboarding.keyLabel")}
          </Text>
          <View className="flex-row items-center rounded-2xl border border-surface-light bg-card-light px-4 dark:border-surface-dark dark:bg-card-dark">
            <TextInput
              accessibilityLabel={t("onboarding.keyLabel")}
              autoCapitalize="none"
              autoCorrect={false}
              className="h-14 flex-1 text-left text-base text-zinc-900 dark:text-zinc-100"
              onChangeText={setKey}
              placeholder="sk-or-v1-..."
              placeholderTextColor={theme === "dark" ? "#71717A" : "#A1A1AA"}
              secureTextEntry={!showKey}
              spellCheck={false}
              textContentType="none"
              value={key}
            />
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel={showKey ? t("onboarding.hideKey") : t("onboarding.showKey")}
              onPress={() => setShowKey((visible) => !visible)}
              className="ml-2 p-2"
            >
              {showKey ? (
                <EyeOff size={20} color={theme === "dark" ? "#A1A1AA" : "#71717A"} />
              ) : (
                <Eye size={20} color={theme === "dark" ? "#A1A1AA" : "#71717A"} />
              )}
            </TouchableOpacity>
          </View>

          <View
            className={`${isArabic ? "flex-row" : "flex-row-reverse"} mt-4 items-start gap-2 rounded-2xl bg-primary-light/5 p-4 dark:bg-primary-dark/5`}
          >
            <ShieldCheck size={18} color={iconColor} />
            <Text
              className={`flex-1 text-xs leading-5 text-zinc-600 dark:text-zinc-400 ${isArabic ? "text-right" : "text-left"}`}
            >
              {t("onboarding.keyPrivacy")}
            </Text>
          </View>

          <View className="flex-1" />
          <TouchableOpacity
            accessibilityRole="button"
            onPress={handleSave}
            className={`${isArabic ? "flex-row-reverse" : "flex-row"} mt-10 h-14 items-center justify-center gap-2 rounded-2xl bg-primary-light px-5 dark:bg-primary-dark`}
          >
            <Text className="text-base font-bold text-white dark:text-zinc-950">
              {t("onboarding.saveAndStart")}
            </Text>
            <ContinueIcon size={19} color={theme === "dark" ? "#09090B" : "#FFFFFF"} />
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
