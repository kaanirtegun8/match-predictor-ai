import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import Animated, { useAnimatedProps, withTiming } from 'react-native-reanimated';
import Svg, { Defs, Mask, Rect } from 'react-native-svg';
import { useTutorial } from '@/contexts/TutorialContext';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
const OVERLAY_OPACITY = 0.75;
const PADDING = 8; // Padding around the highlighted element

const AnimatedRect = Animated.createAnimatedComponent(Rect);

export function TutorialOverlay() {
  const { isActive, targetMeasurements, steps, currentStep } = useTutorial();

  const animatedMaskProps = useAnimatedProps(() => {
    const x = targetMeasurements?.x ?? WINDOW_WIDTH / 2;
    const y = targetMeasurements?.y ?? WINDOW_HEIGHT / 2;
    const width = (targetMeasurements?.width ?? 0) + PADDING * 2;
    const height = (targetMeasurements?.height ?? 0) + PADDING * 2;

    return {
      x: withTiming(x - PADDING, { duration: 300 }),
      y: withTiming(y - PADDING, { duration: 300 }),
      width: withTiming(width, { duration: 300 }),
      height: withTiming(height, { duration: 300 }),
    };
  });

  if (!isActive) return null;

  return (
    <Svg height={WINDOW_HEIGHT} width={WINDOW_WIDTH} style={StyleSheet.absoluteFill}>
      <Defs>
        <Mask id="mask">
          <Rect height="100%" width="100%" fill="white" />
          <AnimatedRect
            animatedProps={animatedMaskProps}
            fill="black"
            rx={12}
            ry={12}
          />
        </Mask>
      </Defs>
      <Rect
        height="100%"
        width="100%"
        fill="rgba(0, 0, 0, 0.75)"
        mask="url(#mask)"
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `rgba(0, 0, 0, ${OVERLAY_OPACITY})`,
  },
}); 