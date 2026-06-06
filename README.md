# shark-home

这是一个基于 Astro 的个人站点，博客内容存放在 `src/content/blog`。

## Commands

- `npm install`: 安装依赖
- `npm run dev`: 启动本地开发环境
- `npm run build`: 构建生产版本
- `npm run preview`: 本地预览构建结果
- `npm run import:wordpress -- <wordpress-export.xml>`: 一次性导入 WordPress 文章和媒体资源

## WordPress 导入

1. 从旧站后台导出标准 WordPress XML。
2. 在仓库根目录运行：

```sh
npm run import:wordpress -- ./wordpress-export.xml
```

导入脚本会：

- 生成文章到 `src/content/blog/<分类>/<slug>.md`
- 下载图片、视频、PDF 和其他附件到 `public/assets/blog/...`
- 将文章正文中的旧站资源链接改成项目内本地路径
- 输出迁移报告到 `docs/blog-import-report.json`
