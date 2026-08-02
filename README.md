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

- 使用 mock 数据
- 未接数据库
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
| `docs` | 产品与架构文档 |

## 开发规范

- 产品文档使用中文
- 代码与数据库命名使用英文
- 用户前台文案使用韩文
- 核心术语遵循 `AGENTS.md` 与 `docs` 文档
- 每次修改前先阅读 `AGENTS.md`

## 部署方式

- `main` 分支 push 到 GitHub 后，由 Vercel 自动部署

示例：

```bash
git add .
git commit -m "docs: improve README and gitignore"
git push
```
