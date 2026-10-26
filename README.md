# Time

一个用 Vue 3 和 [Arco Design Vue](https://arco.design/vue/docs/start) 构建的浏览器本地待办与日历应用。包含今天、本周、本月视图、跨天任务、标记、每日心情和 JSON 数据备份。

## 本地运行

```sh
npm ci
npm run dev
```

运行 `npm run build` 生成静态站点到 `dist/`。

## 数据

数据保存在当前浏览器的 `localStorage` 中，键名为 `time.local.v1`。Vue 版继续使用原始 [单文件版本](reference/index.original.html) 的备份格式。

不同网址、浏览器和设备之间不会自动同步数据。迁移时，在旧页面的「数据备份」中导出 JSON，再到新页面导入。

## 发布

推送到 `main` 后，GitHub Actions 会构建并部署到 GitHub Pages。首次发布时，需在仓库 Settings → Pages 中将 Build and deployment 的 Source 设为 **GitHub Actions**。
