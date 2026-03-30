import Link from "next/link";

export default function NotFound() {
  return (
    <main className="empty-state">
      <p className="eyebrow">未找到页面</p>
      <h1>这个内容节点还没有建立，或者链接已经失效。</h1>
      <p>可以回到首页继续按路线学习，或者先从术语模块重新进入。</p>
      <div className="hero-actions">
        <Link href="/" className="button-primary">
          返回首页
        </Link>
        <Link href="/glossary" className="button-secondary">
          打开术语模块
        </Link>
      </div>
    </main>
  );
}
