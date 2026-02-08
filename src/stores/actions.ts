import type { TextProps } from '@/types';

export function setTextStatus(textProps: TextProps, text: string) {
  textProps.status = text;
}
