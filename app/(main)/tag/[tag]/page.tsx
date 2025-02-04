import { BookmarkList } from "~/components/bookmark-list";
import { EmptyState } from "~/components/empty-state";
import { Search } from "~/components/search";
import { BookmarkWithTags } from "~/server/db/schema";
import { api } from "~/trpc/server";

type TagPageProps = {
  params: Promise<{ tag: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const searchParamsData = await searchParams;
  const search =
    typeof searchParamsData.search === "string"
      ? searchParamsData.search
      : undefined;
  const paramsData = await params;

  const bookmarks = await api.bookmark.getBookmarksByTag.query({
    tagName: paramsData.tag,
    search,
  });

  return (
    <div className="space-y-8">
      <div className="flex gap-4 mx-auto">
        <Search route={"/tag/" + paramsData.tag} search={search} />
      </div>

      <div>
        <h1 className="text-xl font-semibold mb-2 mx-3">{paramsData.tag}</h1>

        {bookmarks.length > 0 ? (
          <BookmarkList
            route="tag"
            bookmarks={bookmarks as unknown as BookmarkWithTags[]}
          />
        ) : (
          <EmptyState
            type="collectionBookmark"
            title="You have no bookmarks in this collection"
            description="Add a bookmark to this collection to see it here."
            action={{
              label: "Add bookmark",
              dialog: "addLink",
            }}
          />
        )}
      </div>
    </div>
  );
}
