import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../store/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import i18n from '../I18n/i18next';
import { useCustomAlert } from '../components/CustomAlert';

const DEV_MODELS = ['qwen2.5:3b', 'qwen2.5:7b', 'llama3.2:3b'];
const PROD_MODELS = [
  'meta-llama/llama-3.2-3b-instruct:free',
  'qwen/qwen-2.5-72b-instruct:free',
];

export default function SettingsScreen() {
  const {
    environment,
    setEnvironment,
    localIp,
    setLocalIp,
    apiKey,
    setApiKey,
    modelName,
    setModelName,
    theme,
    setTheme,
    language,
    setLanguage,
  } = useAppStore();
  const { t } = useTranslation();
  const { showAlert } = useCustomAlert();

  const [tempIp, setTempIp] = useState(localIp);
  const [tempKey, setTempKey] = useState(apiKey);
  const [tempModel, setTempModel] = useState(modelName);
  const [showApiKey, setShowApiKey] = useState(false);


  const handleSave = () => {
    const trimmedIp = tempIp.trim();
    const trimmedKey = tempKey.trim();
    const trimmedModel = tempModel.trim();

    if (environment === 'dev' && !trimmedIp) {
      showAlert({
        title: t('settings.alertTitle'),
        message: t('settings.enterIp'),
        variant: 'error',
      });
      return;
    }

    if (environment === 'prod' && !trimmedKey) {
      showAlert({
        title: t('settings.alertTitle'),
        message: t('settings.enterApiKey'),
        variant: 'error',
      });
      return;
    }

    setLocalIp(trimmedIp);
    setApiKey(trimmedKey);
    setModelName(trimmedModel);

    showAlert({
      title: t('settings.savedTitle'),
      message: t('settings.savedMessage'),
      variant: 'success',
      buttons: [{ text: t('common.ok'), onPress: () => router.back() }],
    });
  };

  const activePresets = environment === 'dev' ? DEV_MODELS : PROD_MODELS;
  const switchActiveColor = theme === 'dark' ? '#7AA891' : '#3D6352';

  return (
    <SafeAreaView className="flex-1 bg-bg-light dark:bg-bg-dark">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          className="flex-1 px-5 pt-4"
          contentContainerStyle={{ paddingBottom: 48 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* الترويسة */}
          <View className={`${i18n.language === 'ar' ? 'flex-row' : 'flex-row-reverse'} items-center justify-between mb-6`}>
            <View className="items-end">
              <Text className="text-2xl font-extrabold text-primary-light dark:text-primary-dark">
                {t('settings.title')}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => router.back()}
              className="bg-card-light dark:bg-card-dark p-2.5 rounded-full border border-surface-light dark:border-surface-dark"
              accessibilityLabel={t('settings.close')}
            >
              <Ionicons
                name="close-outline"
                size={20}
                color={theme === 'dark' ? '#a1a1aa' : '#52525b'}
              />
            </TouchableOpacity>
          </View>

          <View className={`${i18n.language === 'ar' ? 'flex-row' : 'flex-row-reverse'} bg-card-light dark:bg-card-dark p-4 rounded-2xl mb-4 items-center justify-between border border-surface-light dark:border-surface-dark`}>
            <View className="flex-1 mr-4">
              <Text className={`${i18n.language === 'ar' ? 'text-left' : 'text-right'} text-base font-bold text-zinc-800 dark:text-zinc-100`}>
                {t('settings.language')}
              </Text>
              <Text className={`${i18n.language === 'ar' ? 'text-left' : 'text-right'} text-xs text-zinc-500 dark:text-zinc-400 mt-1`}>
                {language === 'ar' ? t('settings.arabic') : t('settings.english')}
                {' · '}
                {t('settings.languageDescription')}
              </Text>
            </View>
            <Switch
              value={language === 'en'}
              onValueChange={(value) => {
                const nextLanguage = value ? 'en' : 'ar';
                setLanguage(nextLanguage);
                void i18n.changeLanguage(nextLanguage);
              }}
              trackColor={{
                false: theme === 'dark' ? '#26322D' : '#E3EAE6',
                true: switchActiveColor,
              }}
              thumbColor="#ffffff"
            />
          </View>

          {/* تبديل الوضع الليلي */}
          <View className={`${i18n.language === 'ar' ? 'flex-row' : 'flex-row-reverse'} bg-card-light dark:bg-card-dark p-4 rounded-2xl mb-4 items-center justify-between border border-surface-light dark:border-surface-dark`}>
            <View className="flex-1 mr-4">
              <Text className={`${i18n.language === 'ar' ? 'text-left' : 'text-right'} text-base font-bold text-zinc-800 dark:text-zinc-100`}>
                {t('settings.darkMode')}
              </Text>
              <Text className={`${i18n.language === 'ar' ? 'text-left' : 'text-right'} text-xs text-zinc-500 dark:text-zinc-400 mt-1`}>
                {theme === 'dark' ? t('settings.darkModeEnabled') : t('settings.dayMode')}
              </Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={(value) => setTheme(value ? 'dark' : 'light')}
              trackColor={{
                false: theme === 'dark' ? '#26322D' : '#E3EAE6',
                true: switchActiveColor,
              }}
              thumbColor="#ffffff"
            />
          </View>

          {/* تبديل البيئة */}
          {environment === 'dev' && (
            <View className={`${i18n.language === 'ar' ? 'flex-row' : 'flex-row-reverse'} bg-card-light dark:bg-card-dark p-4 rounded-2xl mb-4 items-center justify-between border border-surface-light dark:border-surface-dark`}>
              <View className="flex-1 mr-4">
                <Text className={`${i18n.language === 'ar' ? 'text-left' : 'text-right'} text-base font-bold text-zinc-800 dark:text-zinc-100`}>
                  {t('settings.devEnvironment')}
                </Text>
                <Text className={`${i18n.language === 'ar' ? 'text-left' : 'text-right'} text-xs text-zinc-500 dark:text-zinc-400 mt-1`}>
                  {t('settings.devConnection')}
                </Text>
              </View>
              <Switch
                value
                onValueChange={(val) => setEnvironment(val ? 'dev' : 'prod')}
                trackColor={{
                  false: theme === 'dark' ? '#26322D' : '#E3EAE6',
                  true: switchActiveColor,
                }}
                thumbColor="#ffffff"
              />
            </View>
          )}

          {/* إعدادات وضع التطوير */}
          {environment === 'dev' && (
            <View className="bg-card-light dark:bg-card-dark p-4 rounded-2xl mb-4 border border-surface-light dark:border-surface-dark">
              <View className={`${i18n.language === 'ar' ? 'flex-row' : 'flex-row-reverse'} items-center justify-between mb-2`}>
                <View className="flex-row-reverse items-center">
                  <Ionicons
                    name="laptop-outline"
                    size={18}
                    color={switchActiveColor}
                    className="ml-2"
                  />
                  <Text className={`${i18n.language === 'ar' ? 'text-left' : 'text-right'} font-bold text-zinc-800 dark:text-zinc-100`}>
                    {t('settings.laptopIp')}
                  </Text>
                </View>
              </View>
              <Text className={`${i18n.language === 'ar' ? 'text-left' : 'text-right'} text-xs text-zinc-500 dark:text-zinc-400 mb-3`}>
                {t('settings.ipDescription')}
              </Text>
              <TextInput
                className="bg-bg-light dark:bg-bg-dark border border-surface-light dark:border-surface-dark p-3 rounded-xl text-zinc-800 dark:text-zinc-100"
                value={tempIp}
                onChangeText={setTempIp}
                placeholder="192.168.1.10"
                placeholderTextColor="#8da398"
                selectionColor={switchActiveColor}
                keyboardType="decimal-pad"
                autoCapitalize="none"
              />
            </View>
          )}

          {/* إعدادات وضع الإنتاج (مفتاح OpenRouter) */}
          {environment === 'prod' && (
            <View className="bg-card-light dark:bg-card-dark p-4 rounded-2xl mb-4 border border-surface-light dark:border-surface-dark">
              <View className={`${i18n.language === 'ar' ? 'flex-row' : 'flex-row-reverse'} items-center justify-between mb-2`}>
                <View className="flex-row-reverse items-center">
                  <Ionicons
                    name="key-outline"
                    size={18}
                    color={switchActiveColor}
                    className="ml-2"
                  />
                  <Text className={`${i18n.language === 'ar' ? 'text-left' : 'text-right'} font-bold text-zinc-800 dark:text-zinc-100`}>
                    {t('settings.openRouterKey')}
                  </Text>
                </View>
                {tempKey.length > 0 && (
                  <TouchableOpacity onPress={() => setTempKey('')}>
                    <Text className={`${i18n.language === 'ar' ? 'text-left' : 'text-right'} text-xs text-rose-600 dark:text-rose-400 font-medium`}>
                      {t('common.clear')}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
              <Text className={`${i18n.language === 'ar' ? 'text-left' : 'text-right'} text-xs text-zinc-500 dark:text-zinc-400 mb-3`}>
                {t('settings.apiDescription')}
              </Text>
              <View className="flex-row items-center bg-bg-light dark:bg-bg-dark border border-surface-light dark:border-surface-dark rounded-xl px-3">
                <TextInput
                  className="flex-1 py-3 text-zinc-800 dark:text-zinc-100"
                  value={tempKey}
                  onChangeText={setTempKey}
                  placeholder="sk-or-v1-..."
                  placeholderTextColor="#8da398"
                  selectionColor={switchActiveColor}
                  secureTextEntry={!showApiKey}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  onPress={() => setShowApiKey((prev) => !prev)}
                  className="p-1.5"
                  accessibilityLabel={showApiKey ? t('settings.hideKey') : t('settings.showKey')}
                >
                  <Ionicons
                    name={showApiKey ? 'eye-off-outline' : 'eye-outline'}
                    size={20}
                    color={theme === 'dark' ? '#a1a1aa' : '#52525b'}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* اختيار النموذج */}
          <View className="bg-card-light dark:bg-card-dark p-4 rounded-2xl mb-7 border border-surface-light dark:border-surface-dark">
            <View className={`${i18n.language === 'ar' ? 'flex-row' : 'flex-row-reverse'} items-center justify-between mb-2`}>
              <View className="flex-row-reverse items-center">
                <Ionicons
                  name="hardware-chip-outline"
                  size={18}
                  color={switchActiveColor}
                  className="ml-2"
                />
                <Text className={`${i18n.language === 'ar' ? 'text-left' : 'text-right'} font-bold text-zinc-800 dark:text-zinc-100`}>
                  {t('settings.modelName')}
                </Text>
              </View>
              {tempModel.length > 0 && (
                <TouchableOpacity onPress={() => setTempModel('')}>
                  <Text className={`${i18n.language === 'ar' ? 'text-left' : 'text-right'} text-xs text-zinc-500 dark:text-zinc-400`}>
                    {t('settings.default')}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Text className={`${i18n.language === 'ar' ? 'text-left' : 'text-right'} text-xs text-zinc-500 dark:text-zinc-400 mb-3`}>
              {t('settings.modelDescription')}
            </Text>

            <View className="flex-row flex-wrap gap-2 mb-3">
              {activePresets.map((preset) => {
                const isSelected = tempModel === preset;
                return (
                  <TouchableOpacity
                    key={preset}
                    onPress={() => setTempModel(preset)}
                    className={`px-3 py-1.5 rounded-xl border ${
                      isSelected
                        ? 'bg-primary-light dark:bg-primary-dark border-primary-light dark:border-primary-dark'
                        : 'bg-bg-light dark:bg-bg-dark border-surface-light dark:border-surface-dark'
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        isSelected
                          ? 'text-white dark:text-zinc-950'
                          : 'text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {preset}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TextInput
              className="bg-bg-light dark:bg-bg-dark border border-surface-light dark:border-surface-dark p-3 rounded-xl text-zinc-800 dark:text-zinc-100"
              value={tempModel}
              onChangeText={setTempModel}
              placeholder={
                environment === 'dev'
                  ? 'qwen2.5:3b'
                  : 'meta-llama/llama-3.2-3b-instruct:free'
              }
              placeholderTextColor="#8da398"
              selectionColor={switchActiveColor}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* زر الحفظ */}
          <TouchableOpacity
            className="bg-primary-light dark:bg-primary-dark p-4 rounded-2xl items-center shadow-sm"
            onPress={handleSave}
            activeOpacity={0.85}
          >
            <Text className="text-white dark:text-zinc-950 font-bold text-base">
              {t('settings.save')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}