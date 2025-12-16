import React from 'react';

export interface PageContent {
  id: number;
  title: string;
  type: 'intro' | 'practice' | 'challenge';
  content: React.ReactNode;
}

export enum TutorState {
  IDLE = 'idle',
  THINKING = 'thinking',
  HINT = 'hint',
  SUCCESS = 'success',
  ERROR = 'error'
}

export interface InteractiveFractionProps {
  numerator: number;
  denominator: number;
  interactive?: boolean;
  onChange?: (num: number) => void;
}