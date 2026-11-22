import { useState } from 'react';
import { Alert, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ArrowLeft } from 'lucide-react-native';
import { useAppStore } from '../store/useAppStore';
import { CategorySection } from '../components/CategorySection';
import { Plan } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const { history, toggleIdea, clearHistory, theme } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  const iconColor = theme === 'dark' ? '#7AA891' : '#3D6352';

  const handleClearHistory = () => {
    Alert.alert(
      'حذف السجل؟',
      'سيتم حذف جميع الجلسات المحفوظة نهائياً ولا يمكن التراجع عن ذلك.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'حذف الكل',
          style: 'destructive',
          onPress: () => clearHistory(),
        },
      ]
    );
  };

  const handleToggleInSession = (catIdx: number, ideaIdx: number) => {
    if (!selectedPlan) return;

    toggleIdea(selectedPlan.id, catIdx, ideaIdx);

    setSelectedPlan((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        data: {
          ...prev.data,
          categories: prev.data.categories.map((cat, cIdx) =>
            cIdx !== catIdx
              ? cat
              : {
                  ...cat,
                  ideas: cat.ideas.map((idea, iIdx) =>
                    iIdx !== ideaIdx ? idea : { ...idea, isDone: !idea.isDone }
                  ),
                }
          ),
        },
      };
    });
  };

  // عرض تفاصيل جلسة محددة
  if (selectedPlan) {

    return (
      <SafeAreaView className="flex-1 bg-bg-light dark:bg-bg-dark">
        <ScrollView
          className="flex-1 px-5 pt-4"
          contentContainerStyle={{ paddingBottom: 48 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center justify-between mb-6 mt-1">
            <View className="items-start">
              <Text className="text-2xl text-primary-light dark:text-primary-dark">
                تفاصيل الجلسة
              </Text>
              <Text className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                {new Date(selectedPlan.createdAt).toLocaleDateString('ar-SA')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSelectedPlan(null)}
              className="bg-card-light dark:bg-card-dark border border-surface-light dark:border-surface-dark px-2 py-2 rounded-xl flex-row items-center"
              accessibilityLabel="رجوع إلى قائمة الجلسات"
            >
              <ArrowLeft size={24} color={iconColor} />
            </TouchableOpacity>
          </View>

          {selectedPlan.data.categories.map((cat, catIdx) => (
            <CategorySection
              key={catIdx}
              category={cat}
              onToggleIdea={(ideaIdx) => handleToggleInSession(catIdx, ideaIdx)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // عرض قائمة الجلسات السابقة
  return (
    <SafeAreaView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <ScrollView
        className="flex-1 px-5 pt-4"
        contentContainerStyle={{ paddingBottom: 48 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center justify-between mb-6 mt-1">
          <Text className="text-2xl text-primary-light dark:text-primary-dark">
            الجلسات السابقة
          </Text>
          <View className="flex-row items-center">
            {history.length > 0 && (
              <TouchableOpacity
                onPress={handleClearHistory}
                className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 p-2.5 rounded-full mr-2"
                accessibilityLabel="حذف جميع الجلسات"
              >
                <Ionicons name="trash-outline" size={20} color="#DC2626" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-card-light dark:bg-card-dark border border-surface-light dark:border-surface-dark p-2.5 rounded-full"
              accessibilityLabel="رجوع"
            >
              <ArrowLeft size={20} color={iconColor} />
            </TouchableOpacity>
          </View>
        </View>

        {history.length === 0 ? (
          <View className="bg-card-light dark:bg-card-dark border border-surface-light dark:border-surface-dark rounded-2xl p-8 items-center mt-6">
            <Ionicons name="layers-outline" size={32} color={iconColor} />
            <Text className="text-center text-zinc-600 dark:text-zinc-300 font-semibold mt-3">
              لا توجد جلسات محفوظة حتى الآن.
            </Text>
            <Text className="text-center text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              أي نص ترتّبه في الشاشة الرئيسية سيُحفظ هنا
            </Text>
          </View>
        ) : (
          history.map((plan) => {
            const totalIdeas = plan.data.categories.reduce(
              (acc, cat) => acc + cat.ideas.length,
              0
            );
            const doneIdeas = plan.data.categories.reduce(
              (acc, cat) =>
                acc + cat.ideas.filter((idea) => idea.isDone).length,
              0
            );

            return (
              <TouchableOpacity
                key={plan.id}
                className="bg-card-light dark:bg-card-dark p-4 rounded-2xl mb-4 border border-surface-light dark:border-surface-dark"
                onPress={() => setSelectedPlan(plan)}
                activeOpacity={0.75}
              >
                <View className="flex-row-reverse items-center justify-between mb-2">
                  <Text className="text-xs text-zinc-500 dark:text-zinc-400">
                    {new Date(plan.createdAt).toLocaleDateString('ar-SA')}
                  </Text>
                  <Text className="text-xs font-semibold text-primary-light dark:text-primary-dark">
                    {doneIdeas}/{totalIdeas} مكتمل • {plan.data.categories.length} مجموعات
                  </Text>
                </View>

                <Text
                  className="text-right text-zinc-800 dark:text-zinc-100 font-semibold leading-6"
                  numberOfLines={2}
                >
                  {plan.originalText}
                </Text>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}