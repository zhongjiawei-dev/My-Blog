# My-Blog · 钟嘉伟的技术博客

> 软件测试实践记录：接口测试、Web 自动化、数据库验证与缺陷管理。
> 线上地址：**https://zhongjiawei.github.io/My-Blog/**

一个**零构建依赖**的静态博客 —— 没有 npm、没有打包、没有框架，克隆下来双击 `index.html` 就能看。
用原生 HTML / CSS / JavaScript 手写，为的是把页面结构、样式和交互都掌握在自己手里。

---

## ✨ 特性

| 特性 | 说明 |
| :--- | :--- |
| 深浅主题 | 基于 CSS 变量的双主题，切换结果写入 `localStorage`，默认跟随系统 |
| 单页分区 | 首页含 Hero / 关于 / 技能池 / 项目 / 最新文章 / 联系六个区块，锚点平滑滚动 |
| 打字机 | 首页职位行逐字切换四组描述，纯 JS 实现 |
| 滚动揭示 | `IntersectionObserver` 驱动，进入视口逐个淡入，支持 `prefers-reduced-motion` |
| 文章页 | 阅读进度条、目录高亮、代码块、表格、提示框、上下篇导航 |
| 分类筛选 | 文章列表按「接口测试 / 自动化 / 数据库 / 缺陷管理」过滤 |
| 响应式 | 桌面双栏 → 移动端单栏，导航折叠为抽屉菜单 |
| RSS | `feed.xml` 供 GitHub 主页仓库的 Actions 抓取最新文章 |

---

## 📁 目录结构

```
My-Blog/
├── index.html                 # 首页（个人简介 · 技能 · 项目 · 最新文章 · 联系）
├── blog.html                  # 全部文章列表（带分类筛选）
├── 404.html                   # 404 页
├── feed.xml                   # RSS 订阅源（供主页仓库自动同步）
├── .nojekyll                  # 让 GitHub Pages 跳过 Jekyll 处理
├── posts/
│   ├── api-test-postman-jmeter.html    # Postman 到 JMeter：接口测试链路
│   ├── selenium-pom-framework.html     # POM + 数据驱动的 UI 自动化框架
│   ├── mysql-data-verify.html          # SQL 核对数据的四个切入点
│   └── defect-triage.html              # 缺陷单的写法与三次定界
└── assets/
    ├── css/style.css          # 全部样式（设计令牌 + 组件 + 响应式）
    ├── js/main.js             # 主题、打字机、滚动、目录、筛选
    └── img/
        ├── avatar.png         # 头像
        └── favicon.svg        # 站点图标
```

---

## 🚀 本地预览

方式一（最简单）：双击 `index.html`。

方式二（推荐，路径行为与线上一致）：

```bash
# Python 3
python -m http.server 4000

# 或 Node.js
npx serve .
```

然后访问 <http://localhost:4000>。

---

## ✍️ 如何新增一篇文章

1. 复制 `posts/defect-triage.html`，改名为 `posts/your-slug.html`；
2. 修改四处：`<title>`、`.article__cat`（分类）、`.article__head h1`、`.article__meta`（日期 / 时长 / 技术栈）；
3. 正文写在 `<article class="prose">` 里，`<h2 id="s1">` 的 `id` 要和右侧 `.toc` 的锚点对应；
4. 在 `blog.html` 和 `index.html` 的文章列表里各加一个条目（`data-cat` 用于筛选）；
5. 在 `feed.xml` 里追加一个 `<item>`，主页仓库的 Actions 下次运行就会自动同步。

---

## 🌐 部署到 GitHub Pages

```bash
git init
git add .
git commit -m "feat: init personal blog"
git branch -M main
git remote add origin https://github.com/zhongjiawei/My-Blog.git
git push -u origin main
```

然后在仓库 **Settings → Pages**：

- Source 选择 `Deploy from a branch`
- Branch 选择 `main`，目录 `/ (root)`
- 保存后等待 1–2 分钟，访问 `https://zhongjiawei.github.io/My-Blog/`

因为仓库名是 `My-Blog`，站点会挂在 `/My-Blog/` 子路径下，所以本项目所有资源引用都用**相对路径**（`assets/...`、`../assets/...`），不需要额外配置 `base`。

> 若想让站点挂在根路径 `https://zhongjiawei.github.io/`，把仓库改名为 `zhongjiawei.github.io` 即可，路径会自动生效。

---

## 🎨 设计说明

| 令牌 | 深色 | 浅色 |
| :--- | :--- | :--- |
| 背景 | `#0b1120` | `#f6f8fc` |
| 卡片 | `#131c31` | `#ffffff` |
| 主文字 | `#e8eef8` | `#101a2c` |
| 强调色 | `#6366f1`（靛蓝） | 同色 |
| 次强调 | `#22d3ee`（青） | 同色 |

色板取自 Tailwind slate 系列（`#0f172a` / `#1e293b` / `#94a3b8`），强调色用靛蓝到青色的渐变，
和 GitHub 主页 README 的徽章、统计卡片保持同一套视觉语言。

---

## 📄 License

内容（文章、图片）版权归作者所有；代码部分可自由参考。
