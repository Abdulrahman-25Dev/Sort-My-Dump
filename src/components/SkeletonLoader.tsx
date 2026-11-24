import { View } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  withRepeat, 
  withSequence, 
  withTiming,
  useSharedValue,
  withDelay
} from 'react-native-reanimated';
import { useEffect } from 'react';

export function SkeletonCard({ delay = 0 }) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.9, { duration: 800 }),
          withTiming(0.5, { duration: 800 })
        ),
        -1,
        true
      )
    );
  }, [delay, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View 
      style={animatedStyle} 
      className="bg-white dark:bg-zinc-900 p-4 rounded-2xl mb-3 border border-zinc-100 dark:border-zinc-800 shadow-sm"
    >
      <View className=" items-start">
        {/* دائرة التأشير */}
        <View className="w-5 h-5 rounded-full bg-zinc-200 dark:bg-zinc-700 ml-3 mt-1" />
        
        <View className="flex-1">
          {/* عنوان الفكرة */}
          <View className="h-5 bg-zinc-200 dark:bg-zinc-700 rounded-md w-3/4 mb-2 ml-auto" />
          {/* الخطوة التالية */}
          <View className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-md w-full mb-1 ml-auto" />
          <View className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-md w-1/2 mb-3 ml-auto" />
          
          {/* الوسوم */}
          <View className="flex-row-reverse">
            <View className="h-6 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-md ml-2" />
            <View className="h-6 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-md ml-2" />
            <View className="h-6 w-12 bg-zinc-100 dark:bg-zinc-800 rounded-md" />
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export function SkeletonLoader() {
  return (
    <View className="mt-7">
      {/* عنوان المجموعة الوهمي */}
      <View className="flex-row-reverse items-center mb-3 px-1">
        <View className="w-1.5 h-4 bg-zinc-200 dark:bg-zinc-700 rounded-full ml-2" />
        <View className="h-5 w-32 bg-zinc-200 dark:bg-zinc-700 rounded-md" />
      </View>
      
      <SkeletonCard delay={0} />
      <SkeletonCard delay={150} />
      <SkeletonCard delay={300} />
    </View>
  );
}