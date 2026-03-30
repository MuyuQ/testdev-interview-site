import { notFound } from "next/navigation";
import { getTopicsByCategory } from "@/content";
import { CategoryLanding } from "@/components/docs/category-landing";
import { isTopicCategory } from "@/lib/site-config";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  if (!isTopicCategory(category)) {
    notFound();
  }

  return <CategoryLanding category={category} topics={getTopicsByCategory(category)} />;
}
