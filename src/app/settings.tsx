import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useAppStore } from '../store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const { 
    environment, setEnvironment, 
    localIp, setLocalIp, 
    apiKey, setApiKey,
    modelName, setModelName,
    theme, setTheme
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
    <SafeAreaView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView className="flex-1 p-5" contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* الترويسة */}
        <View className="flex-row-reverse items-center justify-between mb-8">
          <Text className="text-2xl font-bold text-primary-dark dark:text-primary-light">الإعدادات</Text>
          <TouchableOpacity onPress={() => router.back()} className="bg-card-light dark:bg-card-dark border border-primary-light/30 p-2 rounded-lg">
            <Text className="text-primary-dark dark:text-primary-light font-bold">إغلاق</Text>
          </TouchableOpacity>
        </View>

        {/* تبديل الوضع */}
        <View className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm mb-6 flex-row-reverse items-center justify-between border border-primary-light/30">
          <View className="flex-1 mr-4">
            <Text className="text-lg font-bold text-right text-primary-dark dark:text-primary-light">الوضع الليلي</Text>
            <Text className="text-sm text-primary-light dark:text-gray-300 text-right mt-1">
              {theme === 'dark' ? 'الوضع الداكن مفعل' : 'الوضع الفاتح مفعل'}
            </Text>
          </View>
          <Switch
            value={theme === 'dark'}
            onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
            trackColor={{ false: '#3b82f6', true: '#2563eb' }}
            thumbColor={theme === 'dark' ? '#f9fafb' : '#f9fafb'}
          />
        </View>

        {/* تبديل البيئة */}
        <View className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm mb-6 flex-row-reverse items-center justify-between border border-primary-light/30">
          <View className="flex-1 mr-4">
            <Text className="text-lg font-bold text-right text-primary-dark dark:text-primary-light">بيئة التطوير (Ollama)</Text>
            <Text className="text-sm text-primary-light dark:text-gray-300 text-right mt-1">قم بتشغيله إذا كنت تتصل بجهازك المحلي</Text>
          </View>
          <Switch 
            value={environment === 'dev'} 
            onValueChange={(val) => setEnvironment(val ? 'dev' : 'prod')} 
            trackColor={{ false: '#3b82f6', true: '#3b82f6' }}
            thumbColor={environment === 'dev' ? '#2563eb' : '#f9fafb'}
          />
        </View>

        {/* إعدادات وضع التطوير */}
        {environment === 'dev' && (
          <View className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm mb-6 border border-primary-light/30">
            <Text className="text-right font-bold text-primary-dark dark:text-primary-light mb-2">IP اللابتوب</Text>
            <Text className="text-right text-xs text-primary-light dark:text-gray-300 mb-3">مثال: 192.168.1.7</Text>
            <TextInput
              className="bg-bg-light dark:bg-bg-dark border border-primary-light/30 p-3 rounded-lg text-right text-primary-dark dark:text-primary-light"
              value={tempIp}
              onChangeText={setTempIp}
              placeholder="192.168.x.x"
              placeholderTextColor={theme === 'dark' ? '#3b82f6' : '#94a3b8'}
              selectionColor="#3b82f6"
              keyboardType="numeric"
            />
          </View>
        )}

        {/* إعدادات وضع الإنتاج */}
        {environment === 'prod' && (
          <View className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm mb-6 border border-primary-light/30">
            <Text className="text-right font-bold text-primary-dark dark:text-primary-light mb-2">مفتاح OpenRouter (BYOK)</Text>
            <Text className="text-right text-xs text-primary-light dark:text-gray-300 mb-3">أدخل مفتاحك الخاص للاستخدام في الإنتاج</Text>
            <TextInput
              className="bg-bg-light dark:bg-bg-dark border border-primary-light/30 p-3 rounded-lg text-left text-primary-dark dark:text-primary-light"
              value={tempKey}
              onChangeText={setTempKey}
              placeholder="sk-or-v1-..."
              placeholderTextColor={theme === 'dark' ? '#3b82f6' : '#94a3b8'}
              selectionColor="#3b82f6"
              secureTextEntry
              autoCapitalize="none"
            />
          </View>
        )}

        {/* اختيار النموذج */}
        <View className="bg-card-light dark:bg-card-dark p-4 rounded-xl shadow-sm mb-8 border border-primary-light/30">
          <Text className="text-right font-bold text-primary-dark dark:text-primary-light mb-2">اسم النموذج (Model ID)</Text>
          <Text className="text-right text-xs text-primary-light dark:text-gray-300 mb-3">اتركه فارغاً لاستخدام النموذج الافتراضي</Text>
          <TextInput
            className="bg-bg-light dark:bg-bg-dark border border-primary-light/30 p-3 rounded-lg text-left text-primary-dark dark:text-primary-light"
            value={tempModel}
            onChangeText={setTempModel}
            placeholder={environment === 'dev' ? 'llama3.2:3b' : 'meta-llama/llama-3.2-3b-instruct:free'}
            placeholderTextColor={theme === 'dark' ? '#3b82f6' : '#94a3b8'}
            selectionColor="#3b82f6"
            autoCapitalize="none"
          />
        </View>

        {/* زر الحفظ */}
        <TouchableOpacity 
          className="bg-primary-dark p-4 rounded-xl items-center shadow-md"
          onPress={handleSave}
        >
          <Text className="text-white font-bold text-lg">حفظ الإعدادات</Text>
        </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}