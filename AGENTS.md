<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# KrCustom 项目开发规则

## 项目定位

- 项目名称：KrCustom
- 韩国品牌名：커스텀코리아
- 平台定位：面向韩国用户的综合定制服务交易平台
- 这不是传统商品商城，核心实体是 **Service**，不是 Product
- 同一个 Service 可以支持：
  - 固定价格直接购买
  - 沟通后询价
  - 用户自带物品寄送给商家定制

## 语言与命名

- 开发者与 Cursor 的沟通使用中文
- 产品文档使用中文
- 代码、变量、函数、类型、文件名和数据库字段使用英文
- 用户实际看到的所有前台页面使用自然韩文
- 禁止在前台页面显示中文
- 禁止使用拼音变量名和韩文变量名
- 前台韩文文案后续必须集中到语言文件中，不要大量硬编码在组件里
- 第一版只正式开放韩文，但代码结构要预留国际化能力

## 本地化格式

- 金额使用韩元格式，例如 `15,000원`
- 日期使用韩国常见格式，例如 `2026.07.12`
- 手机号显示格式例如 `010-1234-5678`

## 核心流程保护

不得擅自删除或简化以下核心流程：

- 用户与商家聊天
- 图片和文件发送
- 商家发送效果图
- 用户确认效果图
- 商家发送报价
- 用户确认报价并付款
- 用户自有物品寄送
- 商家确认收货
- 制作进度
- 商家返还物品

## 开发约束

- 每次修改代码前，必须先遵守本文件（AGENTS.md）中的规则
- 当前阶段不要自行接入数据库、支付、物流或实时聊天服务
- 未经明确要求，不要大规模重构项目
