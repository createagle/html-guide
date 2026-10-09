# 第 35 章 HTML 安全 · 示例

[English](README.md) | **简体中文**

| 示例 | 在线演示 | 说明 |
| --- | --- | --- |
| 35-1 转义与清洗对比 | [01-escape-sanitize.html](https://createagle.github.io/html-guide/chapters/35-security/01-escape-sanitize.html) | 同一段访客输入分别经过 textContent、转义函数、直接 innerHTML 和清洗器，无害化样本只会报告注入的代码有没有执行 |
| 35-2 CSP 拦截演示 | [02-csp.html](https://createagle.github.io/html-guide/chapters/35-security/02-csp.html) | 带严格 CSP 和 Trusted Types 的页面：尝试内联事件处理器、eval、外站图片和请求，以及完整性哈希正确与错误的脚本，看哪些被拦截 |
| 35-3 iframe 的 sandbox | [03-sandbox.html](https://createagle.github.io/html-guide/chapters/35-security/03-sandbox.html) | 开关 sandbox 的各个权限，看嵌入的页面能做什么：执行脚本、保留来源、使用存储、读取父页面、提交表单和打开弹窗 |

练习的初始代码和成品代码见 [exercises/](exercises/README.zh-CN.md)。
