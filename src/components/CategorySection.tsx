import { View, Text } from "react-native";
import { Category, Idea } from "../types";
import { IdeaCard } from "./IdeaCard";
import i18n from "../I18n/i18next";

interface Props {
  category: Category;
  onToggleIdea: (ideaIndex: number) => void;
}

export function CategorySection({ category, onToggleIdea }: Props) {
  return (
    <View className="mb-6">
      {/* رأس التصنيف مع عدّاد خفيف */}
      <View
        className={` ${
          i18n.language === "ar" ? "flex-row-reverse" : "flex-row"
        } items-center justify-between mb-3 px-1.5`}
        style={{ direction: "ltr" }}
      >
        <View
          className={`${
            i18n.language === "ar" ? "flex-row-reverse" : "flex-row"
          } items-center gap-2`}
          style={{ direction: "ltr" }}
        >
          <View className="w-1.5 h-4 bg-indigo-500 rounded-full ml-2" />
          <Text className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            {category.categoryName}
          </Text>
        </View>

        <View className="bg-zinc-200/70 dark:bg-zinc-800/80 px-2 py-0.5 rounded-full">
          <Text className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
            {category.ideas.length}
          </Text>
        </View>
      </View>

      {/* بطاقات الأفكار داخل التصنيف */}
      <View className="gap-2.5">
        {category.ideas.map((idea: Idea, index: number) => (
          <IdeaCard
            key={index}
            idea={idea}
            onToggle={() => onToggleIdea(index)}
          />
        ))}
      </View>
    </View>
  );
}
