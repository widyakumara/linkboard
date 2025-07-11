import { BookmarkContextMenu } from "~/components/bookmark-context-menu";
import { LockOpenIcon } from "~/components/icons/lock-open";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "~/components/primitives/context-menu";
import { Link } from "~/components/primitives/link";
import { auth } from "~/lib/auth/validate-request";
import { cn, getUrlWithPath, truncateText } from "~/lib/utils";
import { BookmarkWithTags } from "~/server/db/schema";

const addReferral = (url: string) => {
  const parsedUrl = new URL(url);
  parsedUrl.searchParams.append("ref", "linkboard.dev");
  return parsedUrl.toString();
};

type BookmarkListProps = {
  bookmarks: BookmarkWithTags[];
  route: "dashboard" | "discover" | "collection" | "tag" | "user-profile";
};

export const BookmarkList = async ({ bookmarks, route }: BookmarkListProps) => {
  const { user } = await auth();

  return (
    <div>
      {bookmarks.map((bookmark) => (
        <ContextMenu key={bookmark.id}>
          <ContextMenuTrigger>
            <div
              className={cn("mb-3 hover:bg-stone-100 p-2 px-3 rounded-lg", {
                "hover:bg-stone-200": route === "user-profile",
              })}
            >
              <div className="flex items-center">
                {route !== "discover" &&
                  route !== "user-profile" &&
                  bookmark.isPublic && (
                    <LockOpenIcon className="size-4 text-muted-foreground mr-1" />
                  )}
                {bookmark.title ? (
                  <>
                    <a
                      href={addReferral(bookmark.url)}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-medium text-black hover:underline mr-2"
                    >
                      {truncateText(bookmark.title)}
                    </a>
                    <a
                      href={addReferral(bookmark.url)}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <span className="text-sm text-muted-foreground">
                        ({new URL(bookmark.url).hostname})
                      </span>
                    </a>
                  </>
                ) : (
                  <a
                    href={addReferral(bookmark.url)}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-medium text-black hover:underline mr-2"
                  >
                    {truncateText(getUrlWithPath({ bookmark }))}
                  </a>
                )}
              </div>

              <div className="flex items-center text-xs text-muted-foreground mt-1">
                {bookmark.tags && bookmark.tags.length > 0 && (
                  <>
                    {bookmark.tags.map((tag) => (
                      <Link href={`/tag/${tag.tag.name}`} key={tag.tag.id}>
                        <span className="mr-2 cursor-pointer hover:underline">
                          {tag.tag.name}
                        </span>
                      </Link>
                    ))}

                    <span className="mr-2">•</span>
                  </>
                )}

                {route === "discover" && bookmark.user?.username && (
                  <>
                    <Link href={`/u/${bookmark.user?.username}`}>
                      <span className="mr-2 hover:underline cursor-pointer">
                        {bookmark.user.username}
                      </span>
                    </Link>
                    <span className="mr-2">•</span>
                  </>
                )}

                <span>
                  {new Date(bookmark.createdAt).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </span>
              </div>
            </div>
          </ContextMenuTrigger>
          {!["user-profile", "discover"].includes(route) && user && (
            <BookmarkContextMenu bookmark={bookmark} />
          )}
        </ContextMenu>
      ))}
    </div>
  );
};
