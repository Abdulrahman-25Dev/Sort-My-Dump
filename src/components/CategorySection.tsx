import { View, Text } from 'react-native';
import { Category, Idea } from '../types';
import { IdeaCard } from './IdeaCard';

interface Props {
  category: Category;
  onToggleIdea: (ideaIndex: number) => void;
}

export function CategorySection({ category, onToggleIdea }: Props) {
  return (
    <View className="mb-6">
      <Text className="text-right text-lg font-bold text-gray-800 mb-3 border-r-4 border-blue-500 pr-2">
        {category.categoryName}
      </Text>
      {category.ideas.map((idea: Idea, index: number) => (
        <IdeaCard 
          key={index} 
          idea={idea} 
          onToggle={() => onToggleIdea(index)} 
        />
      ))}
    </View>
  );
}