import { View, Text, TouchableOpacity } from 'react-native';
import { Idea } from '../types';
import { Ionicons } from '@expo/vector-icons';

export function IdeaCard({ idea, onToggle }: { idea: Idea, onToggle: () => void }) {
  const isTask = idea.type === 'task';

  return (
    <TouchableOpacity 
      className={`flex-row items-start p-4 mb-3 rounded-2xl border ${
        idea.isDone ? 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm'
      }`}
      style={{ direction: 'ltr' }}
      onPress={isTask ? onToggle : undefined}
      activeOpacity={isTask ? 0.7 : 1}
    >
      {/* تغيير الأيقونة حسب النوع: مربع تأشير للمهمة، ومصباح للفكرة */}
      {isTask ? (
        <View className={`w-5 h-5 rounded-full border-2 mt-1 mr-3 items-center justify-center ${idea.isDone ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 dark:border-gray-600'}`}>
          {idea.isDone && <Text className="text-white text-[10px] font-bold">✓</Text>}
        </View>
      ) : (
        <View className="w-5 h-5 mt-1 mr-3 items-center justify-center">
          <Ionicons name="bulb-outline" size={20} color="#eab308" />
        </View>
      )}

      <View className="flex-1 items-end" style={{ direction: 'ltr' }}>
        {/* عنوان الفكرة */}
        <Text
          className={`w-full text-right font-bold text-base mb-1 ${idea.isDone ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-100'}`}
          style={{ writingDirection: 'rtl' }}
        >
          {idea.title}
        </Text>
        
        {/* الخطوة التالية */}
        <Text
          className={`w-full text-right text-sm mb-3 ${idea.isDone ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}
          style={{ writingDirection: 'rtl' }}
        >
          {idea.nextStep}
        </Text>

        {/* الأولويات والنوع */}
        <View className="flex-row flex-wrap justify-end" style={{ direction: 'ltr' }}>
          
          {/* شارة النوع (مهمة أو فكرة) */}
          <View className={`px-2 py-1 rounded-md mr-2 ${isTask ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'bg-amber-50 dark:bg-amber-900/30'}`}>
            <Text className={`text-[10px] font-bold ${isTask ? 'text-indigo-600' : 'text-amber-600'}`}>
              {isTask ? 'مهمة' : 'فكرة'}
            </Text>
          </View>

          {/* شارة الأولوية */}
          <View className={`px-2 py-1 rounded-md mr-2 ${
            idea.priority === 'عاجل' ? 'bg-red-50 dark:bg-red-900/30' : 
            idea.priority === 'مهم' ? 'bg-orange-50 dark:bg-orange-900/30' : 
            'bg-gray-100 dark:bg-gray-700'
          }`}>
            <Text className={`text-[10px] font-bold ${
              idea.priority === 'عاجل' ? 'text-red-600' : 
              idea.priority === 'مهم' ? 'text-orange-600' : 
              'text-gray-600 dark:text-gray-300'
            }`}>
              {idea.priority}
            </Text>
          </View>

          {/* شارة الجهد */}
          <View className="bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md">
            <Text className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
              {idea.estimatedEffort}
            </Text>
          </View>

        </View>
      </View>
    </TouchableOpacity>
  );
}