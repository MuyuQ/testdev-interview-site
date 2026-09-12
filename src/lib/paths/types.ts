// 学习路径数据模型
// 每个分类一条路径：定义该分类下文章的学习顺序、每步目标与可验证产出。
// 时长不在这里写，统一取文章 frontmatter 的 estimatedMinutes，避免两处不一致。

export type CategoryId =
  | 'beginner-course'
  | 'roadmap'
  | 'glossary'
  | 'tech'
  | 'coding'
  | 'project'
  | 'scenario'
  | 'interview-chains'
  | 'practice-template'
  | 'ai-learning';

// 路径中的一步：slug 是该分类下的文章文件名（不含分类前缀、不含 .md）
export interface PathStep {
  slug: string;
  goal: string;
  output: string;
}

export interface CategoryPath {
  id: CategoryId;
  title: string;
  description: string;
  audience: string;
  steps: PathStep[];
}
