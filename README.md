# KrCustom（커스텀코리아）

面向韩国用户的综合定制服务交易平台，同时提供商家生产协同与订单管理能力。

核心实体是 **Service**（定制服务），不是传统电商中的 Product。同一 Service 可支持固定价格购买、沟通后询价，以及用户自带物品寄送定制。

## 当前 V1.0 RC 能力

- 首页与服务浏览 / 搜索 / 分类 / 店铺
- 真实 Email 注册 / 登录 / 登出（Supabase Auth + Header 会话）
- 服务页创建 Project（需登录）→ Project Workspace
- 参考图上传至 Storage（已登录）；Seller / Customer 同页可见
- 项目工作区：报价、效果图、订单、自带物品、Timeline、聊天发送
- Seller Dashboard（待办聚合、通知列表、Realtime 刷新）
- Admin 只读看板（用户 / 商家 / Project / 公告；访问提示，不强制拦截）
- Provider + Repository + Mock fallback；Demo 链路仍可浏览

## 技术栈

- Next.js（App Router）
- React
- TypeScript
- Tailwind CSS
- Supabase（Auth / DB / Storage / Realtime）
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

业务页面通过 Provider 优先读取 Supabase；无数据或失败时自动 fallback 到 mock。

### Seed（Demo Project）

数据库主键使用 **UUID**。前端路由 `/project/prj-001` 中的 `prj-001` 是 **demo_key**，不是主键。正式业务编号使用 **project_number**。

在完成相关 migration 后，于 Supabase **SQL Editor** 执行 `supabase/seed.sql`（或按 migrations 顺序推送后 seed）。

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
/ → /signup|/login → /service/svc-001 → /project/[id]
  → /project/[id]/quote → /design-proofs/[id]
  → /checkout/ord-001 → /orders/ord-001
```

### 商家端

```
/seller → /seller/quotes → /seller/design-proofs
  → /seller/orders → /seller/customer-items
```

### 管理端

```
/admin → /admin/users → /admin/sellers → /admin/projects → /admin/announcements
```

## 当前限制（RC）

- 报价确认 / 修订、效果图上传与修订提交、订单动作按钮多为 Demo UI（本地态或 disabled）
- 支付未接入（Checkout 为演示页）
- 物流 API、聊天图片消息、上传压缩/进度条未做
- Profile / Custom Request / 部分 Seller 菜单为占位
- Admin 无强制鉴权墙（刻意保留 Demo 可读）
- 业务表 RLS 仍偏 Demo 宽松，生产前需收紧

## 项目目录说明

| 目录 | 说明 |
| --- | --- |
| `src/app` | App Router 路由页面 |
| `src/components` | UI 与业务组件 |
| `src/data` | mock 数据 |
| `src/types` | 领域类型 |
| `src/constants` | 状态与工作流常量 |
| `src/lib/supabase` | Supabase 客户端 |
| `src/lib/providers` | 数据 Provider（Supabase + mock fallback） |
| `src/repositories` | Supabase Repository |
| `src/messages` | 韩文文案（`ko.ts`） |
| `supabase/migrations` | 数据库 migration |
| `supabase/seed.sql` | Demo seed |
| `docs` | 产品与架构文档 |

## 开发规范

- 产品文档使用中文
- 代码与数据库命名使用英文
- 用户前台文案使用韩文（集中到 `src/messages/ko.ts`）
- 核心术语遵循 `AGENTS.md` 与 `docs` 文档

## 部署方式

- `main` 分支 push 到 GitHub 后，由 Vercel 自动部署
- 线上环境需在 Vercel Project Settings → Environment Variables 配置相同的 Supabase 变量
