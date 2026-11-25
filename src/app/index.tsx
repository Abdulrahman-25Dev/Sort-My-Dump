import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import {
  Plus,
  History as HistoryIcon,
  Settings,
  Sparkles,
} from "lucide-react-native";
import { useAppStore } from "../store/useAppStore";
import { analyzeBrainDump } from "../lib/ai";
import { CategorySection } from "../components/CategorySection";
import { SkeletonLoader } from "../components/SkeletonLoader";
import { AiResponse } from "../types";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { useTranslation } from "react-i18next";
import i18n from "../I18n/i18next";
import { useCustomAlert } from "../components/CustomAlert";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { showAlert } = useCustomAlert();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResponse | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);
  const { colorScheme } = useColorScheme();
  const headerIconColor =
    colorScheme === "dark" ? "#A9CDB8" : "#254438";
  const analyzeEnabled = Boolean(text.trim()) && !loading;
  const analyzeContentColor =
    colorScheme === "dark"
      ? analyzeEnabled
        ? "black"
        : "white"
      : analyzeEnabled
        ? "white"
        : "black";
  const analyzeContentTextClass =
    analyzeContentColor === "black" ? "text-black" : "text-white";

  const {
    environment,
    apiKey,
    localIp,
    modelName,
    language,
    addPlan,
    toggleIdea,
  } = useAppStore();

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const data = await analyzeBrainDump(text, {
        environment,
        apiKey,
        localIp,
        modelName,
        language,
      });

      const planId = Date.now().toString();
      setResult(data);
      setCurrentPlanId(planId);

      addPlan({
        id: planId,
        createdAt: new Date().toISOString(),
        originalText: text,
        data,
      });

      setText("");
    } catch (error: any) {
      showAlert({
        title: t("alerts.error"),
        message: error instanceof Error ? error.message : String(error),
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleIdea = (catIdx: number, ideaIdx: number) => {
    if (!result || !currentPlanId) return;
    toggleIdea(currentPlanId, catIdx, ideaIdx);

    setResult({
      ...result,
      categories: result.categories.map((cat, cIdx) =>
        cIdx !== catIdx
          ? cat
          : {
              ...cat,
              ideas: cat.ideas.map((idea, iIdx) =>
                iIdx !== ideaIdx ? idea : { ...idea, isDone: !idea.isDone }
              ),
            }
      ),
    });
  };

  const handleResetSession = () => {
    setResult(null);
    setCurrentPlanId(null);
    setText("");
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1 px-5 mt-3"
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ترويسة عصرية ومختلفة */}
          <View className={` items-center justify-between mb-6 mt-1 px-2 ${i18n.language === "ar" ? "flex-row" : "flex-row-reverse"}`}>
            <View className="items-end">
              <Text className="text-lg font-extrabold text-primary-light dark:text-primary-dark">
                {t("home.title")}
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              {result && (
                <TouchableOpacity
                  onPress={handleResetSession}
                  className="p-2.5 rounded-xl bg-surface-light dark:bg-surface-dark"
                  accessibilityLabel={t("home.newSession")}
                >
                  <Plus size={20} color={headerIconColor} strokeWidth={2} />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => router.push("/History")}
                className="p-2.5 rounded-xl bg-surface-light dark:bg-surface-dark"
                accessibilityLabel={t("home.history")}
              >
                <HistoryIcon
                  size={19}
                  color={headerIconColor}
                  strokeWidth={2}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/settings")}
                className="p-2.5 rounded-xl bg-surface-light dark:bg-surface-dark"
                accessibilityLabel={t("home.settings")}
              >
                <Settings
                  size={19}
                  color={headerIconColor}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* بطاقة التفريغ الموحدة */}
          <View className="bg-card-light dark:bg-card-dark rounded-3xl border border-surface-light dark:border-surface-dark shadow-sm overflow-hidden">
            <TextInput
              className="p-5 min-h-[150px] text-zinc-800 dark:text-zinc-100 text-base leading-6"
              multiline
              placeholder={t("home.placeholder")}
              placeholderTextColor="#8da398"
              value={text}
              onChangeText={setText}
              textAlignVertical="top"
            />

            {/* شريط الإجراءات السفلي المدمج داخل البطاقة */}
            <View className={`flex-row-reverse items-center justify-between px-4 py-3 bg-bg-light/70 dark:bg-bg-dark/60 border-t border-surface-light dark:border-surface-dark`}>
              <View className="flex-row-reverse items-center gap-3">
                <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                  {text.trim().length > 0
                    ? t("home.characterCount", { count: text.trim().length })
                    : t("home.ready")}
                </Text>
                {text.length > 0 && !loading && (
                  <TouchableOpacity onPress={() => setText("")}>
                    <Text className="text-xs text-rose-600 dark:text-rose-400 font-medium">
                      {t("home.clear")}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                className={`px-5 py-2.5 rounded-2xl flex-row-reverse items-center ${
                  analyzeEnabled
                    ? "bg-primary-light dark:bg-primary-dark"
                    : "bg-surface-light dark:bg-surface-dark"
                }`}
                onPress={handleAnalyze}
                disabled={!analyzeEnabled}
                activeOpacity={0.85}
              >
                {loading ? (
                  <>
                    <ActivityIndicator
                      color={analyzeContentColor}
                      size="small"
                      className="ml-2"
                    />
                    <Text
                      className={`font-semibold text-sm ${analyzeContentTextClass}`}
                    >
                      {t("home.loading")}
                    </Text>
                  </>
                ) : (
                  <>
                    <Sparkles
                      size={16}
                      color={analyzeContentColor}
                      strokeWidth={2}
                      className="ml-1.5"
                    />
                    <Text
                      className={`font-semibold text-sm pr-2 ${analyzeContentTextClass}`}
                    >
                      {t("home.analyze")}
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* حالة البداية: أمثلة سريعة قابلة للنقر للتجربة الفورية */}
          {!result && !text && !loading && (
            <View className="mt-7">
              <Text className={`${i18n.language === "ar" ? "text-left" : "text-right"} text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-3`}>
                {t("home.examplesTitle")}
              </Text>
              <View className="gap-2.5">
                {[
                  t("home.sample1"),
                  t("home.sample2"),
                  t("home.sample3"),
                ].map((sample, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setText(sample)}
                    className="bg-card-light/80 dark:bg-card-dark/80 border border-surface-light dark:border-surface-dark rounded-2xl p-3.5"
                    activeOpacity={0.7}
                  >
                    <Text className={`${i18n.language === "ar" ? "text-left" : "text-right"} text text-xs text-zinc-700 dark:text-zinc-300 leading-5`}>
                      {sample}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {loading && <SkeletonLoader />}

          {/* عرض النتائج المنظمة */}
          {result && (
            <View className="mt-7">
              {/* المجموعات المصنفة */}
              {result.categories.map((cat, catIdx) => (
                <CategorySection
                  key={catIdx}
                  category={cat}
                  onToggleIdea={(ideaIdx) => handleToggleIdea(catIdx, ideaIdx)}
                />
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}