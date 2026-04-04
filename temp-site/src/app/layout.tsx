import type { Metadata } from "next";
import { JetBrains_Mono, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const themeInitScript = `
(() => {
  try {
    const storageKey = "testdev:theme";
    const storedTheme = localStorage.getItem(storageKey);
    const theme =
      storedTheme === "light" || storedTheme === "dark"
        ? storedTheme
        : window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {}
})();
`;

const notoSansSC = Noto_Sans_SC({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://testdev-map.local"),
  title: {
    default: "测试开发面试速成站",
    template: "%s | 测试开发面试速成站",
  },
  description:
    "面向测试开发岗位的中文结构化内容站，覆盖术语、技术专题、项目类型、场景题、编码题、学习路线与 AI 时代成长指南。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      className={`${notoSansSC.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
