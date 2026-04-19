import { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { fetchNoteById } from "@/lib/api";
import NotePreview from "./NotePreview.client";

interface NoteDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata(
  props: NoteDetailsPageProps,
): Promise<Metadata> {
  const params = await props.params;
  const { id } = params;

  try {
    const note = await fetchNoteById(id);
    const description = note.content
      ? note.content.substring(0, 160)
      : `Read the ${note.title} note in NoteHub`;

    return {
      title: `${note.title} - NoteHub`,
      description,
      openGraph: {
        title: `${note.title} - NoteHub`,
        description,
        url: `https://notehub.example.com/notes/${id}`,
        images: [
          {
            url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
            width: 1200,
            height: 630,
          },
        ],
      },
    };
  } catch (error) {
    return {
      title: "Note - NoteHub",
      description: "View a note in NoteHub",
    };
  }
}

const NoteDetailsPage = async ({ params }: NoteDetailsPageProps) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview />
    </HydrationBoundary>
  );
};

export default NoteDetailsPage;
