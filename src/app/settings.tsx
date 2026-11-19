import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../store/useAppStore';

export default function SettingsScreen() {
  const { 
    environment, setEnvironment, 
    localIp, setLocalIp, 
    apiKey, setApiKey,
    modelName, setModelName 
  } = useAppStore();

  // حالات مؤقتة للتعديل قبل الحفظ
  const [tempIp, setTempIp] = useState(localIp);
  const [tempKey, setTempKey] = useState(apiKey);
  const [tempModel, setTempModel] = useState(modelName);

  const handleSave = () => {
    if (environment === 'dev') {
      if (!tempIp.trim()) {
        Alert.alert('تنبيه', 'الرجاء إدخال IP اللابتوب');
        return;
      }
      setLocalIp(tempIp.trim());
    } else {
      if (!tempKey.trim()) {
        Alert.alert('تنبيه', 'الرجاء إدخال مفتاح OpenRouter');
        return;
      }
      setApiKey(tempKey.trim());
    }
    
    // حفظ اسم النموذج
    setModelName(tempModel.trim());

    Alert.alert('تم الحفظ', 'تم تحديث الإعدادات بنجاح', [
      { text: 'حسناً', onPress: () => router.back() }
    ]);
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView className="flex-1 p-5 pt-12" contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* الترويسة */}
        <View className="flex-row-reverse items-center justify-between mb-8">
          <Text className="text-2xl font-bold text-gray-800">الإعدادات</Text>
          <TouchableOpacity onPress={() => router.back()} className="bg-gray-200 p-2 rounded-lg">
            <Text className="text-gray-600 font-bold">إغلاق</Text>
          </TouchableOpacity>
        </View>

        {/* تبديل البيئة */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-6 flex-row-reverse items-center justify-between border border-gray-100">
          <View className="flex-1 mr-4">
            <Text className="text-lg font-bold text-right text-gray-800">بيئة التطوير (Ollama)</Text>
            <Text className="text-sm text-gray-500 text-right mt-1">قم بتشغيله إذا كنت تتصل بجهازك المحلي</Text>
          </View>
          <Switch 
            value={environment === 'dev'} 
            onValueChange={(val) => setEnvironment(val ? 'dev' : 'prod')} 
            trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
            thumbColor={environment === 'dev' ? '#2563eb' : '#f4f3f4'}
          />
        </View>

        {/* إعدادات وضع التطوير */}
        {environment === 'dev' && (
          <View className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
            <Text className="text-right font-bold text-gray-800 mb-2">IP اللابتوب</Text>
            <Text className="text-right text-xs text-gray-500 mb-3">مثال: 192.168.1.7</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-right"
              value={tempIp}
              onChangeText={setTempIp}
              placeholder="192.168.x.x"
              keyboardType="numeric"
            />
          </View>
        )}

        {/* إعدادات وضع الإنتاج */}
        {environment === 'prod' && (
          <View className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
            <Text className="text-right font-bold text-gray-800 mb-2">مفتاح OpenRouter (BYOK)</Text>
            <Text className="text-right text-xs text-gray-500 mb-3">أدخل مفتاحك الخاص للاستخدام في الإنتاج</Text>
            <TextInput
              className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-left"
              value={tempKey}
              onChangeText={setTempKey}
              placeholder="sk-or-v1-..."
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
        )}

        {/* اختيار النموذج */}
        <View className="bg-white p-4 rounded-xl shadow-sm mb-8 border border-gray-100">
          <Text className="text-right font-bold text-gray-800 mb-2">اسم النموذج (Model ID)</Text>
          <Text className="text-right text-xs text-gray-500 mb-3">اتركه فارغاً لاستخدام النموذج الافتراضي</Text>
          <TextInput
            className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-left"
            value={tempModel}
            onChangeText={setTempModel}
            placeholder={environment === 'dev' ? 'llama3.2:3b' : 'meta-llama/llama-3.2-3b-instruct:free'}
            autoCapitalize="none"
          />
        </View>

        {/* زر الحفظ */}
        <TouchableOpacity 
          className="bg-blue-600 p-4 rounded-xl items-center shadow-md"
          onPress={handleSave}
        >
          <Text className="text-white font-bold text-lg">حفظ الإعدادات</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}