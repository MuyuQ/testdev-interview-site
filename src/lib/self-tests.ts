// 文章自测题数据结构（与 frontmatter 的 selfTests 一致）

export interface SelfTest {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
