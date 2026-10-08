# 第 33 章 性能与资源加载 · 示例

[English](README.md) | **简体中文**

| 示例 | 在线演示 | 说明 |
| --- | --- | --- |
| 33-1 加载策略对比瀑布图 | [01-waterfall.html](https://createagle.github.io/html-guide/chapters/33-performance/01-waterfall.html) | 一次页面加载的简化模型：把脚本切换成阻塞、defer、async，改变主图的写法，加上字体提示，看 FCP 和 LCP 怎样变化 |
| 33-2 图片懒加载 | [02-lazy-images.html](https://createagle.github.io/html-guide/chapters/33-performance/02-lazy-images.html) | 24 张图片分别用 loading="lazy"、IntersectionObserver 和立即加载，实时显示哪些已经下载 |
| 33-3 Speculation Rules 预取与预渲染 | [03-speculation.html](https://createagle.github.io/html-guide/chapters/33-performance/03-speculation.html) | 指向同一页面的三个链接：普通、悬停时预取、悬停时预渲染；目标页报告自己是怎样加载的 |

练习的初始代码和成品代码见 [exercises/](exercises/README.zh-CN.md)。
