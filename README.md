# Vue Dima 问卷低代码编辑器

![Vue](https://img.shields.io/badge/Vue-3-42b883?logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646cff?logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white)
![Element Plus](https://img.shields.io/badge/Element%20Plus-2-409eff)
![Pinia](https://img.shields.io/badge/Pinia-3-f7d336)

一个基于 Vue 3 + Vite + TypeScript 的问卷低代码编辑器，**纯前端项目，无需后端服务**。项目围绕“组件市场 + 可视化画布 + 属性面板”的编辑体验构建，支持通过拖拽快速搭建问卷、保存草稿、预览问卷、生成可分享的答题链接，并可通过浏览器打印导出 PDF。

## 功能亮点

- 可视化问卷编辑：左侧组件/大纲、中间画布、右侧属性编辑面板。
- 组件市场：内置选择题、输入题、高级题型、备注说明、个人信息、联系方式等组件。
- 拖拽排序：基于 `vuedraggable` 实现题目排序和大纲联动。
- 属性配置：支持标题、描述、选项、图片选项、字号、字重、斜体、颜色、对齐方式等配置。
- 撤销/重做：使用命令模式维护编辑历史，支持 `Ctrl + Z`、`Ctrl + Y` / `Ctrl + Shift + Z`。
- 本地草稿：基于 Dexie 封装 IndexedDB，实现问卷保存、编辑、删除和列表展示。
- 本地图片：图片选项支持上传图片，以 base64 形式存储于 IndexedDB，无需任何服务器。
- 本地分享：生成分享问卷并保存到 IndexedDB，答题页从本地读取问卷，提交的答卷同样存入 IndexedDB。
- 预览与导出：支持问卷预览、浏览器打印生成 PDF。

## 技术栈

| 类型 | 技术 |
| --- | --- |
| 前端框架 | Vue 3、Vue Router、Pinia |
| 构建工具 | Vite、TypeScript |
| UI 与交互 | Element Plus、Font Awesome、vuedraggable |
| 本地存储 | Dexie、IndexedDB |
| 工程化 | ESLint、Oxlint、Prettier、vue-tsc |

## 目录结构

```text
.
├── src/
│   ├── components/
│   │   ├── common/               # 通用组件（Header、Avator 等）
│   │   ├── Editor/               # 编辑器组件
│   │   └── SurveyComs/           # 问卷题型组件与属性编辑组件
│   ├── configs/                  # 组件映射、默认状态、组件分组配置
│   ├── db/                       # Dexie / IndexedDB 数据访问
│   ├── router/                   # 页面路由
│   ├── stores/                   # Pinia 状态、命令栈、历史记录
│   ├── types/                    # TypeScript 类型定义
│   ├── utils/                    # 通用工具与保存逻辑
│   └── views/                    # 首页、组件市场、编辑器、预览、答题页
└── vite.config.ts                # Vite 配置
```

## 快速开始

### 环境要求

- Node.js `^20.19.0` 或 `>=22.12.0`
- 推荐使用 `pnpm`

### 安装依赖

```bash
pnpm install
```

### 启动

```bash
pnpm dev
```

默认访问地址：

```text
http://localhost:5173
```

## 常用脚本

```bash
pnpm dev          # 启动开发服务
pnpm build        # 类型检查并打包
pnpm build-only   # 仅打包
pnpm preview      # 预览生产构建
pnpm lint         # 运行 lint 并自动修复
pnpm format       # 格式化 src 目录
```

## 使用流程

1. 打开首页，点击“新建”进入问卷编辑器。
2. 从左侧题型区域选择或添加题目组件。
3. 在中间画布中点击题目，使用右侧面板调整标题、描述、选项、样式等属性。
4. 通过拖拽调整题目顺序，或使用大纲快速定位题目。
5. 点击保存，将问卷写入浏览器 IndexedDB。
6. 点击预览，查看最终问卷效果。
7. 在预览页可以生成本地 PDF，也可以生成本地分享问卷链接。

## 数据存储说明

项目为纯前端应用，所有数据均存储在浏览器的 IndexedDB（Dexie 封装）中：

| 表名 | 用途 |
| --- | --- |
| `surveys` | 本地问卷草稿（编辑/保存/删除） |
| `quizzes` | 生成的分享问卷（答题页数据来源） |
| `answers` | 用户提交的答卷 |

> 注意：数据跟随浏览器（当前域名），清除浏览器数据会导致问卷丢失。分享链接也仅能在同一浏览器中打开。

## 内置题型

- 单选题
- 多选题
- 下拉选择题
- 图片单选题
- 图片多选题
- 文本输入题
- 评分题
- 日期/时间题
- 备注说明
- 个人信息类题目：姓名、身份证、出生日期、性别、年龄、学历、学校、专业、行业、职业、公司、职位
- 联系方式类题目：手机、微信、QQ、邮箱、地址

## 核心设计

### 组件状态模型

每个问卷组件都包含组件名称、渲染组件引用和一组可编辑状态。保存到 IndexedDB 前会序列化组件状态；再次读取时通过 `componentMap` 恢复 Vue 组件引用，从而让保存后的问卷可以继续编辑和渲染。

### 命令式历史记录

编辑器将新增、删除、更新、移动封装为 command，通过 `HistoryManager` 统一执行、撤销和重做。连续文本输入会通过 `DebounceMerger` 合并历史记录，避免每输入一个字符都产生一次撤销步骤。

## 部署

项目是纯静态站点，可以部署到任意静态托管平台（Vercel、Netlify、GitHub Pages 等）：

```bash
pnpm install
pnpm build-only
```

部署后即为 SPA 应用，所有功能（包括分享问卷）均依赖浏览器本地存储。
