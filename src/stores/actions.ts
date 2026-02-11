import type { TextProps ,OptionsProps ,StringStatusArr} from '@/types';
import {isStringArray} from '@/types'

export function setTextStatus(textProps: TextProps, text: string) {
  textProps.status = text;
}

export function addOption(optionProps: OptionsProps) {
  if (isStringArray(optionProps.status)) {
    let lastIndex = optionProps.status.length -1
    let lastString = optionProps.status[lastIndex]
    console.log(lastString);
 
    let lastNum = +lastString?.substring(lastString.length-1)! 
    //小bug，大于两位数及以上，会从0开始
    optionProps.status.push(`新选项${lastNum+1}`);
  }
}

export function removeOption(optionProps: OptionsProps, index: number) {
  if (optionProps.status.length === 2) {
    return false;
  }
  optionProps.status.splice(index, 1);
  return true;
}

export function changePosition(optionProps: OptionsProps,pointStatus:number){
  optionProps.currentStatus = pointStatus
}

export function changeSize(optionProps: OptionsProps,pointStatus:number){
   optionProps.currentStatus = pointStatus
}

export function changeWeight(optionProps: OptionsProps,pointStatus:number){
  optionProps.currentStatus = pointStatus
}

export function changeItalic(optionProps: OptionsProps,pointStatus:number){
  optionProps.currentStatus = pointStatus
}
