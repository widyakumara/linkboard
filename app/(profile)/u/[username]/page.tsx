import { BookmarkList } from "~/components/bookmark-list";
import { EmptyState } from "~/components/empty-state";
import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
} from "~/components/primitives/pagination";
import { BookmarkWithTags } from "~/server/db/schema";
import { api } from "~/trpc/server";

type ProfilePageProps = {
  params: Promise<{ username: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const searchParamsData = await searchParams;
  const page =
    typeof searchParamsData.page === "string" && +searchParamsData.page > 0
      ? +searchParamsData.page
      : 1;
  const perPage = 20;

  const paramsData = await params;

  const { bookmarks } = await api.user.getUserBookmarksAndCollections.query({
    username: paramsData.username,
    bookmarkPage: page,
    bookmarkPerPage: perPage,
  });

  const totalPages = Math.ceil(bookmarks.total / perPage);

  return (
    <div className="space-y-4 w-full">
      <h1 className="text-xl font-semibold mb-2 mx-3">bookmarks</h1>

      {bookmarks.items.length > 0 ? (
        <div>
          <BookmarkList
            route="user-profile"
            bookmarks={bookmarks.items as unknown as BookmarkWithTags[]}
          />

          <div className="mt-10 mx-3 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-semibold">{(page - 1) * perPage + 1}</span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(page * perPage, bookmarks.total)}
              </span>{" "}
              of <span className="font-semibold">{bookmarks.total}</span>{" "}
              bookmarks
            </p>
            <Pagination>
              <PaginationPrevious
                href={
                  page > 1
                    ? `/u/${paramsData.username}?page=${page - 1}`
                    : undefined
                }
              />
              <PaginationNext
                href={
                  page < totalPages
                    ? `/u/${paramsData.username}?page=${page + 1}`
                    : undefined
                }
              />
            </Pagination>
          </div>
        </div>
      ) : (
        <EmptyState
          type="bookmark"
          title="This user has no bookmarks"
          description="This user has not added any bookmarks yet."
        />
      )}
    </div>
  );
}
