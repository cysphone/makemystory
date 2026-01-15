import { getStory } from "@/app/actions";
import { StoryBook } from "@/components/StoryBook";
import { notFound } from "next/navigation";

export default async function StoryPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const story = await getStory(id);

    if (!story) {
        notFound();
    }

    return <StoryBook story={story} />;
}
