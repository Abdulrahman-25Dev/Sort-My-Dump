import { View, Text, TouchableOpacity } from 'react-native';
import { Effort, Idea, Priority } from '../types';
import { Lightbulb } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { useTranslation } from 'react-i18next';
import i18n from '@/I18n/i18next';

export function IdeaCard({ idea, onToggle }: { idea: Idea, onToggle: () => void }) {
  const isTask = idea.type === 'task';
  const { colorScheme } = useColorScheme();
  const { t } = useTranslation();
  const ideaIconColor = colorScheme === 'dark' ? '#8BB8A1' : '#2F5242';
  const priorityLabels: Record<Priority, string> = {
    'عاجل': t('idea.priority.urgent'),
    'مهم': t('idea.priority.important'),
    'لاحقاً': t('idea.priority.later'),
  };
  const effortLabels: Record<Effort, string> = {
    'سهل': t('idea.effort.easy'),
    'متوسط': t('idea.effort.medium'),
    'صعب': t('idea.effort.hard'),
  };

  return (
    <TouchableOpacity 
      className={`${i18n.language === 'ar' ? 'flex-row' : 'flex-row-reverse'} p-4 mb-3 rounded-2xl border ${
        idea.isDone
          ? 'bg-bg-light dark:bg-bg-dark border-surface-light dark:border-surface-dark'
          : 'bg-card-light dark:bg-card-dark border-surface-light dark:border-surface-dark shadow-sm'
      }`}
      style={{ direction: 'ltr' }}
      onPress={isTask ? onToggle : undefined}
      activeOpacity={isTask ? 0.7 : 1}
    >
      {/* تغيير الأيقونة حسب النوع: مربع تأشير للمهمة، ومصباح للفكرة */}
      {isTask ? (
        <View className={`w-6 h-6 rounded-full border-2 mt-1 mr-3 items-center justify-center ${idea.isDone ? 'bg-primary-light dark:bg-primary-dark border-primary-light dark:border-primary-dark' : 'border-primary-light/40 dark:border-primary-dark/40'}`}>
          {idea.isDone && <Text className="text-white dark:text-black text-[10px] font-bold">✓</Text>}
        </View>
      ) : (
        <View className="w-5 h-5 mt-1 mr-3 items-center justify-center">
          <Lightbulb size={20} color={ideaIconColor} strokeWidth={2} />
        </View>
      )}

      <View className={`flex-1 ${i18n.language === 'ar' ? 'items-end' : 'items-start'}`} style={{ direction: 'ltr' }}>
        {/* عنوان الفكرة */}
        <Text
        className={`w-full ${i18n.language === 'ar' ? 'text-right' : 'text-left'} font-bold text-base mb-1 ${idea.isDone ? 'line-through text-primary-light/50 dark:text-primary-dark/50' : 'text-primary-light dark:text-primary-dark'}`}
          style={{ writingDirection: 'rtl' }}
        >
          {idea.title}
        </Text>
        
        {/* الخطوة التالية */}
        <Text
          className={`w-full ${i18n.language === 'ar' ? 'text-right' : 'text-left'} text-sm mb-3 ${idea.isDone ? 'text-primary-light/40 dark:text-primary-dark/40' : 'text-primary-light/80 dark:text-primary-dark/80'}`}
          style={{ writingDirection: 'rtl' }}
        >
          {idea.nextStep}
        </Text>

        {/* الأولويات والنوع */}
        <View className={` ${i18n.language === 'ar' ? 'flex-row' : 'flex-row-reverse'} flex-wrap justify-end`} style={{ direction: 'ltr' }}>
          
          {/* شارة النوع (مهمة أو فكرة) */}
          <View className={`px-2 py-1 rounded-md mr-2 ${isTask ? 'bg-teal-100 dark:bg-teal-900/40' : 'bg-sky-100 dark:bg-sky-900/40'}`}>
            <Text className={`text-[10px] font-bold ${isTask ? 'text-teal-700 dark:text-teal-300' : 'text-sky-700 dark:text-sky-300'}`}>
              {isTask ? t('idea.task') : t('idea.thought')}
            </Text>
          </View>

          {/* شارة الأولوية */}
          <View className={`px-2 py-1 rounded-md mr-2 ${
            idea.priority === 'عاجل' ? 'bg-rose-100 dark:bg-rose-900/40' :
            idea.priority === 'مهم' ? 'bg-amber-100 dark:bg-amber-900/40' :
            'bg-slate-100 dark:bg-slate-800/70'
          }`}>
            <Text className={`text-[10px] font-bold ${
              idea.priority === 'عاجل' ? 'text-rose-700 dark:text-rose-300' :
              idea.priority === 'مهم' ? 'text-amber-700 dark:text-amber-300' :
              'text-slate-600 dark:text-slate-300'
            }`}>
              {priorityLabels[idea.priority]}
            </Text>
          </View>

          {/* شارة الجهد */}
          <View className="bg-indigo-100 dark:bg-indigo-900/40 px-2 py-1 rounded-md">
            <Text className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
              {effortLabels[idea.estimatedEffort]}
            </Text>
          </View>

        </View>
      </View>
    </TouchableOpacity>
  );
}