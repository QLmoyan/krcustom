# KrCustom（커스텀코리아）

面向韩国用户的综合定制服务交易平台，同时提供商家生产协同与订单管理能力。

核心实体是 **Service**（定制服务），不是传统电商中的 Product。同一 Service 可支持固定价格购买、沟通后询价，以及用户自带物品寄送定制。

## 当前 Alpha 功能

- 首页与服务浏览
- 服务详情
- 项目工作区（Project Workspace）
- 报价版本管理
- 效果图确认
- 订单与支付 Demo
- 用户自带物品管理
- 商家工作台
- 完整演示链路

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS
- Supabase（已完成客户端基础接入）
- Vercel
- GitHub

## 本地运行

```bash
git clone https://github.com/QLmoyan/krcustom.git
cd krcustom
npm install
npm run dev
```

浏览器访问：[http://localhost:3000](http://localhost:3000)

### Supabase 环境变量

1. 复制 `.env.example` 为 `.env.local`（若尚未创建）
2. 在 [Supabase Dashboard](https://supabase.com/dashboard) 打开你的 Project
3. 进入 **Project Settings → API Keys**（或顶部 **Connect** 面板）
4. 填入：

```bash
NEXT_PUBLIC_SUPABASE_URL=你的 Project URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=你的 Publishable Key
```

客户端封装位置：

- 浏览器：`src/lib/supabase/client.ts`
- 服务端：`src/lib/supabase/server.ts`

当前业务页面通过 Provider 优先读取 Supabase；无数据或失败时自动 fallback 到 mock。

### Seed（Demo Project）

数据库主键使用 **UUID**。前端路由 `/project/prj-001` 中的 `prj-001` 是 **demo_key**，不是主键。正式业务编号使用 **project_number**。

在完成 `projects` 相关 migration 后，于 Supabase **SQL Editor** 依次执行：

1. `supabase/migrations/20260802223000_projects_project_number_and_demo_key.sql`（若尚未执行）
2. `supabase/seed.sql`（写入 Demo Project，可重复执行）

Seed 要点：

| 字段 | 值 |
| --- | --- |
| `id` | `11111111-1111-4111-8111-111111111111`（UUID PK） |
| `project_number` | `PRJ-20260802-001` |
| `demo_key` | `prj-001`（对应路由 `/project/prj-001`） |

执行后访问 `/project/prj-001`，开发环境右下角应显示 `DATA SOURCE / Supabase`。

## 线上演示

[https://krcustom.vercel.app](https://krcustom.vercel.app)

## 主要演示路径

### 用户端

```
/ → /service/svc-001 → /project/prj-001 → /project/prj-001/quote
  → /design-proofs/dp-prj001-v4 → /checkout/ord-001 → /orders/ord-001
```

### 商家端

```
/seller → /seller/quotes → /seller/design-proofs
  → /seller/orders → /seller/customer-items
```

## 当前限制

本阶段为 Alpha 演示，存在以下限制：

- Project 已支持 Supabase + mock fallback；其它模块仍主要为 mock
- 未接真实登录
- 未接真实支付
- 未接物流 API
- 未接实时聊天

## 项目目录说明

| 目录 | 说明 |
| --- | --- |
| `src/app` | App Router 路由页面（用户端、商家端、项目工作区） |
| `src/components` | UI 与业务组件 |
| `src/data` | mock 数据与查询辅助函数 |
| `src/types` | 领域类型定义 |
| `src/constants` | 统一状态常量等 |
| `src/lib/supabase` | Supabase 浏览器 / 服务端客户端 |
| `src/lib/providers` | 数据 Provider（Supabase + mock fallback） |
| `src/repositories` | Supabase Repository |
| `supabase/migrations` | 数据库 migration |
| `supabase/seed.sql` | Demo seed（UUID PK + demo_key `prj-001`） |
| `docs` | 产品与架构文档 |

## 开发规范

- 产品文档使用中文
- 代码与数据库命名使用英文
- 用户前台文案使用韩文
- 核心术语遵循 `AGENTS.md` 与 `docs` 文档
- 每次修改前先阅读 `AGENTS.md`

## 部署方式

- `main` 分支 push 到 GitHub 后，由 Vercel 自动部署
- 线上环境需在 Vercel Project Settings → Environment Variables 配置相同的 Supabase 变量

示例：

```bash
git add .
git commit -m "chore: add supabase client foundation"
git push
```
