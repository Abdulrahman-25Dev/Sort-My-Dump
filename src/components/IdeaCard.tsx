import { View, Text, TouchableOpacity } from 'react-native';
import { Idea } from '../types';
import { Lightbulb } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';

export function IdeaCard({ idea, onToggle }: { idea: Idea, onToggle: () => void }) {
  const isTask = idea.type === 'task';
  const { colorScheme } = useColorScheme();
  const ideaIconColor = colorScheme === 'dark' ? '#8BB8A1' : '#2F5242';

  return (
    <TouchableOpacity 
      className={`flex-row items-start p-4 mb-3 rounded-2xl border ${
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
        <View className={`w-5 h-5 rounded-full border-2 mt-1 mr-3 items-center justify-center ${idea.isDone ? 'bg-primary-light dark:bg-primary-dark border-primary-light dark:border-primary-dark' : 'border-primary-light/40 dark:border-primary-dark/40'}`}>
          {idea.isDone && <Text className="text-white text-[10px] font-bold">✓</Text>}
        </View>
      ) : (
        <View className="w-5 h-5 mt-1 mr-3 items-center justify-center">
          <Lightbulb size={20} color={ideaIconColor} strokeWidth={2} />
        </View>
      )}

      <View className="flex-1 items-end" style={{ direction: 'ltr' }}>
        {/* عنوان الفكرة */}
        <Text
          className={`w-full text-right font-bold text-base mb-1 ${idea.isDone ? 'line-through text-primary-light/50 dark:text-primary-dark/50' : 'text-primary-light dark:text-primary-dark'}`}
          style={{ writingDirection: 'rtl' }}
        >
          {idea.title}
        </Text>
        
        {/* الخطوة التالية */}
        <Text
          className={`w-full text-right text-sm mb-3 ${idea.isDone ? 'text-primary-light/40 dark:text-primary-dark/40' : 'text-primary-light/80 dark:text-primary-dark/80'}`}
          style={{ writingDirection: 'rtl' }}
        >
          {idea.nextStep}
        </Text>

        {/* الأولويات والنوع */}
        <View className="flex-row flex-wrap justify-end" style={{ direction: 'ltr' }}>
          
          {/* شارة النوع (مهمة أو فكرة) */}
          <View className={`px-2 py-1 rounded-md mr-2 ${isTask ? 'bg-primary-light/10 dark:bg-primary-dark/15' : 'bg-accent-light/10 dark:bg-accent-dark/15'}`}>
            <Text className={`text-[10px] font-bold ${isTask ? 'text-primary-light dark:text-primary-dark' : 'text-accent-light dark:text-accent-dark'}`}>
              {isTask ? 'مهمة' : 'فكرة'}
            </Text>
          </View>

          {/* شارة الأولوية */}
          <View className={`px-2 py-1 rounded-md mr-2 ${
            idea.priority === 'عاجل' ? 'bg-accent-light/15 dark:bg-accent-dark/20' :
            idea.priority === 'مهم' ? 'bg-primary-light/15 dark:bg-primary-dark/20' :
            'bg-surface-light dark:bg-surface-dark'
          }`}>
            <Text className={`text-[10px] font-bold ${
              idea.priority === 'عاجل' ? 'text-accent-light dark:text-accent-dark' :
              idea.priority === 'مهم' ? 'text-primary-light dark:text-primary-dark' :
              'text-primary-light/70 dark:text-primary-dark/70'
            }`}>
              {idea.priority}
            </Text>
          </View>

          {/* شارة الجهد */}
          <View className="bg-surface-light dark:bg-surface-dark px-2 py-1 rounded-md">
            <Text className="text-[10px] font-bold text-primary-light dark:text-primary-dark">
              {idea.estimatedEffort}
            </Text>
          </View>

        </View>
      </View>
    </TouchableOpacity>
  );
}