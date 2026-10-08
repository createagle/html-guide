# 第 21 章 表单提交与数据 · 示例

[English](README.md) | **简体中文**

| 示例 | 在线演示 | 说明 |
| --- | --- | --- |
| 21-1 浏览器发出的请求 | [01-request-preview.html](https://createagle.github.io/html-guide/chapters/21-submission/01-request-preview.html) | 切换 method 和 enctype，查看表单将要发出的请求，以及哪些字段不会被提交 |
| 21-2 一个表单，多个按钮 | [02-submitter.html](https://createagle.github.io/html-guide/chapters/21-submission/02-submitter.html) | 「发布」「存草稿」「预览」「删除」四个按钮，使用 name/value、formaction、formmethod、formtarget、formnovalidate，并通过 event.submitter 读出 |
| 21-3 不刷新页面的提交 | [03-fetch-submit.html](https://createagle.github.io/html-guide/chapters/21-submission/03-fetch-submit.html) | 不依赖 JavaScript 也能用的评论表单；有 JavaScript 时通过 fetch 提交，带进行中状态、防重复提交和错误处理（服务器为模拟） |

练习的初始代码和成品代码见 [exercises/](exercises/README.zh-CN.md)。
