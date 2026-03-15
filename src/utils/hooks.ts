import { computed } from 'vue';
import { isSurveyComName } from '@/types';
import type { Status } from '@/types';

// 这个函数用来判断当前选中的组件是否是问卷题目组件

export function useIsSurveyCom(currentCom: Status[]) {
  return computed(() => {
    let questionNumber = 1;
    return currentCom.map((com) => {
      // 需要判断当前这个组件是不是问卷题目
      if (isSurveyComName(com.name)) {
        return questionNumber++;
      }
      return null;
    });
  }
  )
}
