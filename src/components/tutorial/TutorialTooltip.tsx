import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useTutorial } from '@/contexts/TutorialContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '../themed/ThemedText';
import { useTranslation } from 'react-i18next';

const { width: WINDOW_WIDTH, height: WINDOW_HEIGHT } = Dimensions.get('window');
const TOOLTIP_MARGIN = 8;
const TOOLTIP_MAX_WIDTH = 300;

export function TutorialTooltip() {
  const { isActive, targetMeasurements, steps, currentStep, nextStep, prevStep, skipTutorial } = useTutorial();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const currentTooltip = steps[currentStep];
  const position = currentTooltip?.position ?? 'bottom';
  const isLastStep = currentStep === steps.length - 1;

  // Button visibility configuration with defaults
  const showNextButton = currentTooltip?.hasNextButton ?? true;
  const showSkipButton = currentTooltip?.hasSkipButton ?? true;
  const showBackButton = (currentTooltip?.hasBackButton ?? true) && currentStep > 0;
  const showFinishButton = isLastStep && (currentTooltip?.hasFinishButton ?? true);

  // Button text configuration
  const nextButtonText = currentTooltip?.customNextText ?? t('tutorial.buttons.next');
  const finishButtonText = currentTooltip?.customFinishText ?? t('tutorial.buttons.finish');
  const skipButtonText = currentTooltip?.customSkipText ?? t('tutorial.buttons.skip');
  const backButtonText = currentTooltip?.customBackText ?? t('tutorial.buttons.back');

  // Button handlers
  const handleNext = () => {
    if (currentTooltip?.onNext) {
      currentTooltip.onNext();
    }
    nextStep();
  };

  const handleBack = () => {
    if (currentTooltip?.onPrev) {
      currentTooltip.onPrev();
    }
    prevStep();
  };

  const handleFinish = () => {
    if (currentTooltip?.onFinish) {
      currentTooltip.onFinish();
    }
    skipTutorial();
  };

  const calculatePosition = () => {
    if (!targetMeasurements) return { x: 0, y: 0 };

    const { x, y, width, height } = targetMeasurements;
    let tooltipX = x + width / 2 - TOOLTIP_MAX_WIDTH / 2;
    let tooltipY = y;

    // Adjust horizontal position to stay within screen bounds
    tooltipX = Math.max(TOOLTIP_MARGIN, Math.min(tooltipX, WINDOW_WIDTH - TOOLTIP_MAX_WIDTH - TOOLTIP_MARGIN));

    // Calculate vertical position based on specified position
    switch (position) {
      case 'top':
        tooltipY = y - TOOLTIP_MARGIN - 200;
        break;
      case 'bottom':
        tooltipY = y + height + TOOLTIP_MARGIN + 10;
        break;
      case 'left':
        tooltipX = x - TOOLTIP_MAX_WIDTH - TOOLTIP_MARGIN;
        tooltipY = y + height / 2 - 60;
        break;
      case 'right':
        tooltipX = x + width + TOOLTIP_MARGIN;
        tooltipY = y + height / 2 - 60;
        break;
    }

    return { x: tooltipX, y: tooltipY };
  };

  const tooltipPosition = calculatePosition();

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: withSpring(tooltipPosition.x) },
        { translateY: withSpring(tooltipPosition.y) },
        { scale: withSpring(1) },
      ],
      opacity: withTiming(1, { duration: 200 }),
    };
  });

  if (!isActive) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle, { backgroundColor: colors.background }]}>
      {/* Title */}
      {currentTooltip?.title && (
        <ThemedText style={[styles.title, { color: colors.text }]}>
          {currentTooltip.title}
        </ThemedText>
      )}

      {/* Message */}
      <ThemedText style={[styles.message, { color: colors.text }]}>
        {currentTooltip?.message}
      </ThemedText>

      {/* Navigation Buttons */}
      <View style={styles.buttonsContainer}>
        {/* Back Button */}
        {showBackButton && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.border }]}
            onPress={handleBack}>
            {backButtonText ? (
              <ThemedText style={[styles.buttonText, { color: colors.text }]}>
                {backButtonText}
              </ThemedText>
            ) : (
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            )}
          </TouchableOpacity>
        )}

        {/* Skip Button */}
        {showSkipButton && (
          <TouchableOpacity
            style={[styles.button, styles.skipButton, { backgroundColor: colors.border }]}
            onPress={skipTutorial}>
            <ThemedText style={[styles.buttonText, { color: colors.text }]}>
              {skipButtonText}
            </ThemedText>
          </TouchableOpacity>
        )}

        {/* Next/Finish Button */}
        {(showNextButton || showFinishButton) && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={showFinishButton ? handleFinish : handleNext}>
            <ThemedText style={[styles.buttonText, { color: colors.buttonText }]}>
              {showFinishButton ? finishButtonText : nextButtonText}
            </ThemedText>
            {!showFinishButton && (
              <Ionicons name="arrow-forward" size={20} color={colors.buttonText} />
            )}
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: TOOLTIP_MAX_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 4,
  },
  skipButton: {
    paddingHorizontal: 12,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
}); 