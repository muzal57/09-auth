import { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api/serverApi";
import NotesClient from "./Notes.client";

interface FilteredNotesPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export async function generateMetadata(
  props: FilteredNotesPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const slugParam = params.slug?.[0] || "all";
  const filterTag = slugParam === "all" ? "all" : slugParam;

  const title =
    filterTag === "all"
      ? "All Notes - NoteHub"
      : `${filterTag} Notes - NoteHub`;
  const description =
    filterTag === "all"
      ? "View all your notes in NoteHub"
      : `View all your ${filterTag} notes in NoteHub`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.example.com/notes/filter/${slugParam}`,
      images: [
        {
          url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

const FilteredNotesPage = async ({ params }: FilteredNotesPageProps) => {
  const resolvedParams = await params;
  const slugParam = resolvedParams.slug?.[0] || "all";
  const filterTag = slugParam === "all" ? undefined : slugParam;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", "", 1, filterTag ?? "all"],
    queryFn: () => fetchNotes("", 1, 10, filterTag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={filterTag} />
    </HydrationBoundary>
  );
};

export default FilteredNotesPage;
