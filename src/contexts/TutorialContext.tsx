import React, { createContext, useContext, useState, useRef, RefObject } from 'react';
import { Dimensions, InteractionManager } from 'react-native';

const window = Dimensions.get('window');

export interface TutorialStep {
  targetRef: RefObject<any>;
  message: string;
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  onNext?: () => void;
  onPrev?: () => void;
  onFinish?: () => void;
  spotlightRadius?: number;
  // Button configuration
  hasNextButton?: boolean;
  hasSkipButton?: boolean;
  hasBackButton?: boolean;
  hasFinishButton?: boolean;
  customNextText?: string;
  customFinishText?: string;
  customSkipText?: string;
  customBackText?: string;
}

interface TutorialContextType {
  isActive: boolean;
  currentStep: number;
  steps: TutorialStep[];
  targetMeasurements: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
  nextStep: () => void;
  prevStep: () => void;
  skipTutorial: () => void;
  startTutorial: (steps: TutorialStep[]) => void;
  measureTarget: () => void;
}

interface TutorialProviderProps {
  children: React.ReactNode;
}

const defaultMeasurements = {
  x: window.width / 2,
  y: window.height / 2,
  width: 0,
  height: 0,
};

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: TutorialProviderProps) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<TutorialStep[]>([]);
  const [targetMeasurements, setTargetMeasurements] = useState(defaultMeasurements);

  const measureTarget = () => {
    const currentTarget = steps[currentStep]?.targetRef.current;
    if (currentTarget) {
      currentTarget.measure((_x: number, _y: number, width: number, height: number, pageX: number, pageY: number) => {
        setTargetMeasurements({
          x: pageX,
          y: pageY,
          width,
          height,
        });
      });
    }
  };

  const startTutorial = (newSteps: TutorialStep[]) => {
    if (newSteps.length > 0) {
      setSteps(newSteps);
      setCurrentStep(0);    
      setIsActive(true);
      measureTarget();
    }
  };

  const nextStep = () => {
    const nextStepIndex = currentStep + 1;
    setCurrentStep(nextStepIndex);
    if (nextStepIndex <= steps.length - 1) {
      setCurrentStep(nextStepIndex);
      measureTarget();
    } else {
      skipTutorial();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const prevStepIndex = currentStep - 1;
      setCurrentStep(prevStepIndex);
      InteractionManager.runAfterInteractions(() => {
        measureTarget();
      });
    }
  };

  const skipTutorial = () => {
    setIsActive(false);
    setCurrentStep(0);
    setSteps([]);
    setTargetMeasurements(defaultMeasurements);
  };

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        currentStep,
        steps,
        targetMeasurements,
        nextStep,
        prevStep,
        skipTutorial,
        startTutorial,
        measureTarget,
      }}>
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
} 