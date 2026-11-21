import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../store/useAppStore";
import { analyzeBrainDump } from "../lib/ai";
import { CategorySection } from "../components/CategorySection";
import { AiResponse } from "../types";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResponse | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);

  const { environment, apiKey, localIp, modelName, addPlan, toggleIdea } =
    useAppStore();

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
      Alert.alert("عذراً", error.message);
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
                iIdx !== ideaIdx ? idea : { ...idea, isDone: !idea.isDone },
              ),
            },
      ),
    });
  };

  const handleResetSession = () => {
    setResult(null);
    setCurrentPlanId(null);
    setText("");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50 dark:bg-zinc-950">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ترويسة عصرية ومختلفة */}
          <View className="flex-row items-center justify-between mb-6 mt-1 px-2">
            <View className="items-end">
              <Text className="text-xl font-extrabold text-zinc-900 dark:text-zinc-100">
                رتب أفكاري
              </Text>
              {/* <Text 
              className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5"
              >
                حوّل فوضى الأفكار إلى وضوح
              </Text> */}
            </View>

            <View className="flex-row items-center gap-2">
              {result && (
                <TouchableOpacity
                  onPress={handleResetSession}
                  className="p-2.5 rounded-xl bg-zinc-200/70 dark:bg-zinc-900"
                  accessibilityLabel="جلسة جديدة"
                >
                  <Ionicons name="add-outline" size={20} color="#52525b" />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => router.push("/History")} // تم تعديلها إلى حروف صغيرة لتطابق اسم الملف
                className="p-2.5 rounded-xl bg-zinc-200/70 dark:bg-zinc-900"
                accessibilityLabel="السجل"
              >
                <Ionicons name="layers-outline" size={19} color="#52525b" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/settings")}
                className="p-2.5 rounded-xl bg-zinc-200/70 dark:bg-zinc-900"
                accessibilityLabel="الإعدادات"
              >
                <Ionicons name="options-outline" size={19} color="#52525b" />
              </TouchableOpacity>
            </View>
          </View>

          {/* بطاقة التفريغ الموحدة */}
          <View className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-sm overflow-hidden">
            <TextInput
              className="p-5 text-right min-h-[150px] text-zinc-800 dark:text-zinc-100 text-base leading-6"
              multiline
              placeholder="أفرغ ما في ذهنك هنا... أفكار، مشاريع، تساؤلات، خواطر بدون ترتيب"
              placeholderTextColor="#a1a1aa"
              value={text}
              onChangeText={setText}
              textAlignVertical="top"
            />

            {/* شريط الإجراءات السفلي المدمج داخل البطاقة */}
            <View className="flex-row-reverse items-center justify-between px-4 py-3 bg-zinc-50/80 dark:bg-zinc-900/90 border-t border-zinc-100 dark:border-zinc-800">
              <View className="flex-row-reverse items-center gap-3">
                <Text className="text-xs text-zinc-400">
                  {text.trim().length > 0
                    ? `${text.trim().length} حرف`
                    : "جاهز للتفريغ"}
                </Text>
                {text.length > 0 && !loading && (
                  <TouchableOpacity onPress={() => setText("")}>
                    <Text className="text-xs text-rose-500 font-medium">
                      مسح
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity
                className={`px-5 py-2.5 rounded-2xl flex-row-reverse items-center ${
                  !text.trim() || loading
                    ? "bg-zinc-300 dark:bg-zinc-800"
                    : "bg-zinc-900 dark:bg-indigo-600"
                }`}
                onPress={handleAnalyze}
                disabled={!text.trim() || loading}
                activeOpacity={0.85}
              >
                {loading ? (
                  <>
                    <ActivityIndicator
                      color="white"
                      size="small"
                      className="ml-2"
                    />
                    <Text className="text-white font-semibold text-sm">
                      يرتّب...
                    </Text>
                  </>
                ) : (
                  <>
                    <Ionicons
                      name="sparkles"
                      size={16}
                      color="white"
                      className="ml-1.5"
                    />
                    <Text className="text-white font-semibold text-sm">
                      رتّب أفكاري
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* حالة البداية: أمثلة سريعة قابلة للنقر للتجربة الفورية */}
          {!result && !text && !loading && (
            <View className="mt-7">
              <Text className="text-right text-xs font-semibold text-zinc-400 mb-3">
                أو جرّب تفريغاً سريعاً:
              </Text>
              <View className="gap-2.5">
                {[
                  "أبي أطور تطبيق لتنظيم الأفكار، وأحتاج أراجع خطة النشر على X، وعندي تساؤل عن أفضل نموذج عربي محلي",
                  "فكرة سلسلة مقالات عن بناء المشاريع الفردية + أحتاج أرتب مكتبي اليوم + أبحث عن كتاب في تصميم المنتجات",
                ].map((sample, idx) => (
                  <TouchableOpacity
                    key={idx}
                    onPress={() => setText(sample)}
                    className="bg-white/70 dark:bg-zinc-900/60 border border-zinc-200/60 dark:border-zinc-800 rounded-2xl p-3.5"
                    activeOpacity={0.7}
                  >
                    <Text className="text-right text-xs text-zinc-600 dark:text-zinc-400 leading-5">
                      {sample}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* عرض النتائج المنظمة */}
          {result && (
            <View className="mt-7">
              {/* روابط واقتراحات الدمج إن وجدت */}
              {result.mergedSuggestions &&
                result.mergedSuggestions.length > 0 && (
                  <View className="mb-5 bg-amber-50/90 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-800/40 rounded-2xl p-4">
                    <View className="flex-row-reverse items-center mb-2">
                      <Ionicons
                        name="git-merge-outline"
                        size={16}
                        color="#d97706"
                        className="ml-1.5"
                      />
                      <Text className="text-xs font-bold text-amber-800 dark:text-amber-300">
                        روابط واقتراحات دمج
                      </Text>
                    </View>
                    {result.mergedSuggestions.map((item, idx) => (
                      <Text
                        key={idx}
                        className="text-right text-xs text-amber-900/80 dark:text-amber-200/80 leading-5 mt-1"
                      >
                        • {item}
                      </Text>
                    ))}
                  </View>
                )}

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
