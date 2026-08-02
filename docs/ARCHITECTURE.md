# KrCustom 架构说明（Sprint 3.5 Foundation）

## 当前技术栈

- Next.js（App Router）+ React + TypeScript
- Tailwind CSS
- ESLint
- 当前阶段全部使用本地 mock 数据，无数据库、无真实 API、无支付/物流/实时聊天接入

## 目录结构（简要）

```
src/
  app/            # 路由页面（用户端、商家端、项目工作区）
  components/     # UI 与业务组件（layout / service / seller / project / quote / ui）
  constants/      # 统一状态常量（无 JSX）
  data/           # mock 数据与查询辅助函数
  lib/            # 格式化、文件分类等纯工具
  messages/       # 韩文文案
  types/          # 领域类型
docs/             # 产品与架构文档
```

## 核心业务模块

- **Service**：商家发布的定制服务（非库存商品）
- **Project Workspace**：一次定制交易的协作空间（聊天、报价、效果图、自带物品、物流、制作）
- **Quote**：报价版本与金额（V1/V2/…，不可覆盖历史）
- **CustomerOwnedItem**：用户自带物品全流程（发货 → 收货确认 → 制作 → 返还）
- **Seller Dashboard**：商家待办、订单概览、快捷入口

## 端与工作区关系

- 用户端浏览 Service，进入询价/购买后进入 Project Workspace
- 商家端在 Dashboard / Quotes / Customer Items 处理任务，关键协作回到同一 Project
- 报价编写器挂在 Project 下：`/project/[id]/quote`

## Service · Project · Quote · CustomerOwnedItem

- 一个 Service 可反复下单，每次交易对应一个 Project
- Quote 属于 Project，按 version 追加，不覆盖旧版本
- 若交易方式包含自带物品，则 Project 关联 CustomerOwnedItem（物品编号可检索）

## 状态常量使用规则

- 统一从 `src/constants/status.ts` 引用领域状态码
- 每个状态提供：英文 code、韩文 label、category、韩文 description
- UI 状态展示优先使用 `StatusBadge`（`domain + status` 或显式 `label + tone`）
- `Badge` 仅用于非流程状态标签（交易方式、优先级、特性标签等）
- 禁止在业务组件内再次硬编码一套状态颜色表

## 时间线使用规则

- 共享类型：`src/types/TimelineEvent.ts`
- Project / Quote / CustomerOwnedItem 活动日志优先使用 `TimelineEvent`
- `status`：`COMPLETED | CURRENT | UPCOMING | ERROR | CANCELLED`
- `actorType`：`CUSTOMER | SELLER | SYSTEM | ADMIN`

## 文件类型使用规则

- 共享类型：`src/types/UploadedFile.ts`
- 分类与扩展名判断：`src/lib/file.ts`
- 当前不做真实上传；仅约定字段与辅助函数，供后续聊天/效果图/附件复用

## 组件命名规范

- 页面级视图：`*View` / `*Page`（路由文件用 `page.tsx`）
- 领域模块：`Project*Module`、`Quote*`、`Seller*`
- 基础 UI：`src/components/ui/*`
- 常量与类型名用英文 PascalCase / SCREAMING_SNAKE；前台可见文案用韩文

## 后续接数据库时的边界

- mock 查询函数（`get*ById`）可替换为 repository / server action，但页面与组件尽量保持消费同一类型
- 状态码以 constants 为准，避免在 DB 存韩文展示名
- 文件元数据用 `UploadedFile`，对象存储 URL 填入 `url` / `thumbnailUrl`
- 权限仅有类型（`Role.ts`），真实鉴权留到后台会话接入时实现

## 当前仍为 mock 的说明

数据均在 `src/data/mock*.ts`：保存草稿、发报价、确认效果图、支付、物流等按钮为演示态（禁用或无后端效果）。本阶段可静态浏览与交互布局，不可当作生产数据源。
