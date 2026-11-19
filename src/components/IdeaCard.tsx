import { View, Text, TouchableOpacity } from 'react-native';
import { Idea } from '../types';

interface Props {
  idea: Idea;
  onToggle: () => void;
}

// دالة لترجمة القيم للعرض
const translatePriority = (p: string) => p === 'High' ? 'عاجل' : p === 'Medium' ? 'مهم' : 'لاحقاً';
const translateEffort = (e: string) => e === 'Easy' ? 'سهل' : e === 'Medium' ? 'متوسط' : 'صعب';

export function IdeaCard({ idea, onToggle }: Props) {
  return (
    <TouchableOpacity 
      className={`flex-row-reverse items-start p-3 mb-3 rounded-xl border ${idea.isDone ? 'bg-gray-50 border-gray-200' : 'bg-white border-blue-100 shadow-sm'}`}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      {/* مربع التأشير */}
      <View className={`w-6 h-6 rounded-md border-2 mt-1 ml-3 items-center justify-center ${idea.isDone ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
        {idea.isDone && <Text className="text-white text-xs font-bold">✓</Text>}
      </View>

      <View className="flex-1">
        {/* عنوان الفكرة */}
        <Text className={`text-right font-bold text-base mb-1 ${idea.isDone ? 'line-through text-gray-400' : 'text-gray-800'}`}>
          {idea.title}
        </Text>
        
        {/* الخطوة التالية */}
        <Text className={`text-right text-sm mb-2 ${idea.isDone ? 'text-gray-400' : 'text-gray-600'}`}>
          💡 الخطوة التالية: {idea.nextStep}
        </Text>

        {/* الأولويات (مترجمة) */}
        <View className="flex-row-reverse items-center">
          <View className={`px-2 py-1 rounded-md ml-2 ${idea.priority === 'High' ? 'bg-red-100' : idea.priority === 'Medium' ? 'bg-orange-100' : 'bg-gray-100'}`}>
            <Text className={`text-xs font-bold ${idea.priority === 'High' ? 'text-red-600' : idea.priority === 'Medium' ? 'text-orange-600' : 'text-gray-600'}`}>
              {translatePriority(idea.priority)}
            </Text>
          </View>
          <View className="bg-blue-50 px-2 py-1 rounded-md">
            <Text className="text-xs font-bold text-blue-600">{translateEffort(idea.estimatedEffort)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}