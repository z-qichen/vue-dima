import type { TextProps, OptionsProps, PicLink, Status } from '@/types';
// 题目类型
export type SurveyComName =
  | 'single-select'
  | 'single-pic-select'
  | 'personal-info-gender'
  | 'personal-info-education';

// 业务组件类型(题目类型 + 非题目类型)
export type Material = SurveyComName | 'text-note';

export interface Actions {
  setTextStatus: (textProps: TextProps, text: string) => void;
  addOption: (optionProps: OptionsProps) => void;
  removeOption: (optionProps: OptionsProps, index: number) => number;
  setPosition: (optionProps: OptionsProps, index: number) => void;
  setCurrentStatus: (optionProps: OptionsProps, index: number) => void;
  setPicLinkByIndex: (optionProps: OptionsProps, payload: PicLink) => void;
}

// 仓库状态
export interface MaterialStore extends Actions {
  currentMaterialCom: Material;
  coms: Record<Material, Status>;
  setCurrentSurveyCom: (com: Material) => void;
}

export type  surveyComsArr = [
  'single-select',
   'single-pic-select',
  'personal-info-gender',
  'personal-info-education'
]
export function isSurveyComName(name: string): name is SurveyComName {
  const surveyComs: surveyComsArr = [
    'single-select',
    'single-pic-select',
    'personal-info-gender',
    'personal-info-education',
  ];
  return surveyComs.includes(name as SurveyComName);
}
