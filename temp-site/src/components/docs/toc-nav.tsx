export type TocItem = {
  id: string;
  label: string;
};

type TocNavProps = {
  items: TocItem[];
};

export function TocNav({ items }: TocNavProps) {
  if (!items.length) {
    return <p className="toc-empty">这一页以概览为主，没有拆分更多小节。</p>;
  }

  return (
    <nav className="toc-nav" aria-label="本页目录">
      {items.map((item) => (
        <a key={item.id} href={`#${item.id}`}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}

