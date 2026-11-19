import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../store/useAppStore';
import { analyzeBrainDump } from '../lib/ai';
import { CategorySection } from '../components/CategorySection';
import { AiResponse } from '../types';

export default function HomeScreen() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AiResponse | null>(null);

  const { environment, apiKey, localIp, modelName, addPlan, toggleIdea } = useAppStore();

  const handleAnalyze = async () => {
    if (!text.trim()) {
      Alert.alert('تنبيه', 'الرجاء كتابة بعض الأفكار أولاً');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await analyzeBrainDump(text, { environment, apiKey, localIp, modelName });
      setResult(data);
      
      // حفظ الخطة في السجل
      addPlan({
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        originalText: text,
        data: data
      });
      
      setText(''); // تفريغ الحقل بعد النجاح
    } catch (error: any) {
      Alert.alert('عذراً', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleIdea = (catIndex: number, ideaIndex: number) => {
    // تحديث الواجهة محلياً (Optimistic UI)
    if (result) {
      const newResult = { ...result };
      newResult.categories[catIndex].ideas[ideaIndex].isDone = !newResult.categories[catIndex].ideas[ideaIndex].isDone;
      setResult(newResult);
    }
    // تحديث التخزين (بما أن النتيجة الحالية هي آخر خطة، نمرر الـ ID الخاص بها)
    // ملاحظة: لتبسيط الكود حالياً، سنعتمد على تحديث الواجهة فقط في هذه الجلسة.
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView className="flex-1 p-5 pt-12" contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* الترويسة */}
        <View className="flex-row-reverse items-center justify-between mb-8">
          <Text className="text-2xl font-bold text-gray-800">رتّب أفكاري 🧠</Text>
          <TouchableOpacity onPress={() => router.push('/settings')} className="bg-white p-2 px-4 rounded-lg shadow-sm border border-gray-200">
            <Text className="text-blue-600 font-bold">الإعدادات</Text>
          </TouchableOpacity>
        </View>

        {/* حقل الإدخال */}
        <TextInput
          className="bg-white p-4 rounded-xl text-right min-h-[150px] mb-4 border border-gray-200 shadow-sm"
          multiline
          placeholder="اكتب أفكارك هنا بشكل عشوائي... ودعنا نرتبها لك."
          value={text}
          onChangeText={setText}
          textAlignVertical="top"
        />

        {/* زر التحليل */}
        <TouchableOpacity 
          className={`p-4 rounded-xl items-center shadow-md ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
          onPress={handleAnalyze}
          disabled={loading}
        >
          {loading ? (
            <View className="flex-row-reverse items-center">
              <ActivityIndicator color="white" className="ml-2" />
              <Text className="text-white font-bold text-lg">جاري الترتيب...</Text>
            </View>
          ) : (
            <Text className="text-white font-bold text-lg">رتّب الآن ✨</Text>
          )}
        </TouchableOpacity>

        {/* عرض النتائج */}
        {result && (
          <View className="mt-8">
            <Text className="text-right text-xl font-bold text-gray-800 mb-4">النتيجة:</Text>
            {result.categories.map((cat, catIdx) => (
              <CategorySection 
                key={catIdx} 
                category={cat} 
                onToggleIdea={(ideaIdx) => handleToggleIdea(catIdx, ideaIdx)} 
              />
            ))}
            {result.mergedSuggestions.length > 0 && (
              <View className="bg-yellow-50 p-4 rounded-xl mt-2 border border-yellow-200">
                <Text className="text-right font-bold text-yellow-800 mb-2">اقتراحات إضافية:</Text>
                {result.mergedSuggestions.map((sug, idx) => (
                  <Text key={idx} className="text-right text-yellow-700 mb-1">- {sug}</Text>
                ))}
              </View>
            )}
          </View>
        )}

      </ScrollView>
    </KeyboardAvoidingView>
  );
}