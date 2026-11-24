import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BrainIcon } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

interface CustomSplashProps {
  onFinish: () => void;
}

export function CustomSplash({ onFinish }: CustomSplashProps) {
  const { t } = useTranslation();
  const iconScale = useSharedValue(0.92);
  const iconOpacity = useSharedValue(1);
  const textOpacity = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    iconScale.value = withSpring(1, { damping: 12, stiffness: 120 });
    textOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));
    screenOpacity.value = withDelay(2000, withTiming(0, { duration: 500 }));

    const timer = setTimeout(onFinish, 2500);
    return () => clearTimeout(timer);
  }, [onFinish, iconScale, screenOpacity, textOpacity]);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.overlay, screenStyle]}>
      {/* الخلفية المتدرجة (تدرج داكن وأنيق) */}
      <LinearGradient
        colors={['#09090B', '#18181B']}
        style={styles.container}
      >
        {/* الأيقونة (دماغ) */}
        <View style={styles.iconWrapper}>
          <Animated.View style={[styles.iconCircle, iconStyle]}>
            <BrainIcon size={44} color="#FBBF24" strokeWidth={1.8} />
          </Animated.View>
        </View>

        {/* اسم التطبيق */}
        <Animated.View style={[styles.textContainer, textStyle]}>
          <Text style={styles.title}>BrainSort</Text>
          <Text style={styles.subtitle}>
            {t('splash.subtitle')}
          </Text>
        </Animated.View>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    zIndex: 999,
  },
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  iconWrapper: {
    height: 104,
    width: 104,
    marginBottom: 24,
  },
  iconCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(39, 39, 42, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(63, 63, 70, 0.5)',
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '800',
  },
  subtitle: {
    color: '#A1A1AA',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 8,
    fontWeight: '500',
  },
});