import { BookmarkList } from "~/components/bookmark-list";
import { EmptyState } from "~/components/empty-state";
import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
} from "~/components/primitives/pagination";
import { Search } from "~/components/search";
import { BookmarkWithTags } from "~/server/db/schema";
import { api } from "~/trpc/server";

type DiscoverPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DiscoverPage({
  searchParams,
}: DiscoverPageProps) {
  const searchParamsData = await searchParams;
  const search =
    typeof searchParamsData.search === "string"
      ? searchParamsData.search
      : undefined;

  const perPage = 20;
  const page =
    typeof searchParamsData.page === "string" && +searchParamsData.page > 0
      ? +searchParamsData.page
      : 1;

  const { bookmarks, totalBookmarks } =
    await api.bookmark.getPublicBookmarks.query({
      search,
      page,
      perPage,
    });

  const totalPages = Math.ceil(totalBookmarks / perPage);

  return (
    <div>
      <div className="flex gap-4 mx-auto">
        <Search route="/discover" search={search} />
      </div>

      <div className="mt-8 space-y-4">
        <h1 className="text-xl font-semibold mb-2 mx-3">discover</h1>

        {bookmarks.length > 0 ? (
          <div>
            <BookmarkList
              route="discover"
              bookmarks={bookmarks as unknown as BookmarkWithTags[]}
            />
            <div className="mt-10 mx-3 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-semibold">
                  {(page - 1) * perPage + 1}
                </span>{" "}
                to{" "}
                <span className="font-semibold">
                  {Math.min(page * perPage, totalBookmarks)}
                </span>{" "}
                of <span className="font-semibold">{totalBookmarks}</span>{" "}
                bookmarks
              </p>
              <Pagination>
                <PaginationPrevious
                  href={
                    page > 1
                      ? `/discover?page=${page - 1}${
                          search ? `&search=${search}` : ""
                        }`
                      : undefined
                  }
                />
                <PaginationNext
                  href={
                    page < totalPages
                      ? `/discover?page=${page + 1}${
                          search ? `&search=${search}` : ""
                        }`
                      : undefined
                  }
                />
              </Pagination>
            </div>
          </div>
        ) : search ? (
          <EmptyState
            type="search"
            title="No bookmarks found"
            description="Try searching for something else."
          />
        ) : (
          <EmptyState
            type="discover"
            title="Discover your next favorite thing"
            description="It's a little quiet here. Add a bookmark and make it public for others to view it."
          />
        )}
      </div>
    </div>
  );
}
