# 浏览器扩展模板

这是一个通用的浏览器扩展开发模板，支持 Chrome 扩展和 Firefox 扩展两种形式。项目使用TypeScript开发，采用 Rspack 构建，并集成了Tailwind CSS框架。

## 功能特性

- 支持 Chrome 扩展和用户脚本两种形式
- 使用 TypeScript 开发，提供完整的类型支持
- 基于 Webpack 的模块化构建
- 集成 Tailwind CSS框架
- 多语言支持(i18n)
- 提供常用的工具函数和 Polyfill
- 包含 Popup 页面和 Dashboard 页面

## 安装方法

### Chrome扩展

1. 克隆本仓库
2. 运行 `npm install` 安装依赖
3. 运行 `npm run build:chrome` 构建扩展
4. 在Chrome中加载解压的扩展程序，选择 `dist/chrome` 目录

## 开发指南

1. 安装依赖：
   ```bash
   npm install
   ```

2. 开发模式：
   ```bash
   npm run dev
   ```

3. 构建生产版本：
   ```bash
   # Chrome扩展
   npm run build:chrome
   
   # 用户脚本
   npm run build:firefox
   ```

4. 运行测试：
   ```bash
   npm test
   ```

## 项目结构

```
.
├── package/            # Webpack配置
├── src/
│   ├── assets/         # 静态资源
│   ├── background/     # 后台脚本
│   ├── common/         # 公共模块
│   ├── content/        # 内容脚本
│   ├── dash/           # Dashboard页面
│   ├── document/       # 文档脚本
│   ├── i18n/           # 国际化资源
│   ├── polyfill/       # Polyfill
│   ├── popup/          # Popup页面
│   ├── types/          # 类型定义
│   └── utils/          # 工具函数
├── .env.develop        # 开发环境配置
├── .env.production     # 生产环境配置
├── package.json        # 项目配置
├── tailwind.config.js  # Tailwind配置
└── tsconfig.json       # TypeScript配置
```

