import { notFound } from "next/navigation";
import { getGlossaryLookup, getTopic } from "@/content";
import { TopicPage } from "@/components/docs/topic-page";
import { isTopicCategory } from "@/lib/site-config";

type TopicDetailPageProps = {
  params: Promise<{ category: string; slug: string }>;
};

export default async function TopicDetailPage({
  params,
}: TopicDetailPageProps) {
  const { category, slug } = await params;

  if (!isTopicCategory(category)) {
    notFound();
  }

  const topic = getTopic(category, slug);

  if (!topic) {
    notFound();
  }

  return <TopicPage topic={topic} glossaryLookup={getGlossaryLookup()} />;
}
