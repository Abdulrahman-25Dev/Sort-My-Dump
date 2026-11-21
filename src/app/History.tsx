import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../store/useAppStore';
import { CategorySection } from '../components/CategorySection';
import { Plan } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  const { history, toggleIdea } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  // إذا تم اختيار خطة، نعرضها
  if (selectedPlan) {
    return (
      <SafeAreaView className="flex-1 bg-bg-light dark:bg-bg-dark">
        <ScrollView className="flex-1 p-5">
          <View className="flex-row-reverse items-center justify-between mb-6">
            <Text className="text-2xl font-bold text-primary-dark dark:text-primary-light">تفاصيل الخطة</Text>
            <TouchableOpacity onPress={() => setSelectedPlan(null)} className="bg-card-light dark:bg-card-dark border border-primary-light/30 p-2 px-4 rounded-lg">
              <Text className="text-primary-dark dark:text-primary-light font-bold">رجوع</Text>
            </TouchableOpacity>
          </View>

          {selectedPlan.data.categories.map((cat, catIdx) => (
            <CategorySection
              key={catIdx}
              category={cat}
              onToggleIdea={(ideaIdx) => {
                // تحديث التخزين
                toggleIdea(selectedPlan.id, catIdx, ideaIdx);
                // تحديث الواجهة المحلية
                const updatedPlan = { ...selectedPlan };
                updatedPlan.data.categories[catIdx].ideas[ideaIdx].isDone = !updatedPlan.data.categories[catIdx].ideas[ideaIdx].isDone;
                setSelectedPlan(updatedPlan);
              }}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // إذا لم يتم اختيار خطة، نعرض القائمة
  return (
    <SafeAreaView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <ScrollView className="flex-1 p-5">
        <View className="flex-row-reverse items-center justify-between mb-6">
          <Text className="text-2xl font-bold text-primary-dark dark:text-primary-light">الخطط السابقة</Text>
          <TouchableOpacity onPress={() => router.back()} className="bg-card-light dark:bg-card-dark border border-primary-light/30 p-2 px-4 rounded-lg">
            <Text className="text-primary-dark dark:text-primary-light font-bold">إغلاق</Text>
          </TouchableOpacity>
        </View>

        {history.length === 0 ? (
          <Text className="text-center text-primary-light mt-10">لا توجد خطط محفوظة حتى الآن.</Text>
        ) : (
          history.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              className="bg-card-light dark:bg-card-dark p-4 rounded-xl mb-4 shadow-sm border border-primary-light/30"
              onPress={() => setSelectedPlan(plan)}
            >
              <Text className="text-xs text-primary-light text-right mb-2">
                {new Date(plan.createdAt).toLocaleDateString('ar-SA')}
              </Text>
              <Text className="text-right text-primary-dark dark:text-primary-light font-semibold" numberOfLines={2}>
                {plan.originalText}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}