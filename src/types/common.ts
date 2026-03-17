import type { defineComponent } from 'vue';
import type { TextProps, Material, OptionsProps } from '@/types';

// 导出 vue 组件类型
export type VueComType = ReturnType<typeof defineComponent>;

// 组件状态，也就是包含了 type、name、id、status 这些属性
export interface Status {
  type: VueComType;
  name: Material;
  id: string;
  status: {
    [key: string]: TextProps | OptionsProps;
  };
}
