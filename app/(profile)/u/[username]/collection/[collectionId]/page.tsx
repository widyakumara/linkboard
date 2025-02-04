import { BookmarkList } from "~/components/bookmark-list";
import { EmptyState } from "~/components/empty-state";
import {
  Pagination,
  PaginationNext,
  PaginationPrevious,
} from "~/components/primitives/pagination";
import { BookmarkWithTags } from "~/server/db/schema";
import { api } from "~/trpc/server";

type CollectionPageProps = {
  params: Promise<{
    collectionId: string;
    username: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function CollectionPage({
  params,
  searchParams,
}: CollectionPageProps) {
  const searchParamsData = await searchParams;
  const search =
    typeof searchParamsData.search === "string"
      ? searchParamsData.search
      : undefined;
  const perPage = 10;
  const page =
    typeof searchParamsData.page === "string" && +searchParamsData.page > 0
      ? +searchParamsData.page
      : 1;
  const paramsData = await params;

  const collection = await api.collection.getUserCollectionByUsername.query({
    id: paramsData.collectionId,
    username: paramsData.username,
    page,
    perPage,
  });

  const totalPages = Math.ceil(collection.bookmarks.total / perPage);

  return (
    <div className="space-y-4 w-full">
      <h1 className="text-xl font-semibold mb-2 mx-3">
        collection / {collection.name}
      </h1>
      {collection.bookmarks.items.length > 0 ? (
        <div>
          <BookmarkList
            route="user-profile"
            bookmarks={
              collection.bookmarks.items.map(
                (b) => b.bookmark
              ) as unknown as BookmarkWithTags[]
            }
          />
          <div className="mt-10 mx-3 flex items-center justify-between">
            <p className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-semibold">{(page - 1) * perPage + 1}</span>{" "}
              to{" "}
              <span className="font-semibold">
                {Math.min(page * perPage, collection.bookmarks.total)}
              </span>{" "}
              of{" "}
              <span className="font-semibold">
                {collection.bookmarks.total}
              </span>{" "}
              bookmarks
            </p>
            <Pagination>
              <PaginationPrevious
                href={
                  page > 1
                    ? `/u/${paramsData.username}/collection/${
                        paramsData.collectionId
                      }?page=${page - 1}${search ? `&search=${search}` : ""}`
                    : undefined
                }
              />
              <PaginationNext
                href={
                  page < totalPages
                    ? `/u/${paramsData.username}/collection/${
                        paramsData.collectionId
                      }?page=${page + 1}${search ? `&search=${search}` : ""}`
                    : undefined
                }
              />
            </Pagination>
          </div>
        </div>
      ) : (
        <EmptyState
          type="bookmark"
          title="This collection has no bookmarks"
          description="This collection does not have any bookmarks yet."
        />
      )}
    </div>
  );
}
