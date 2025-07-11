"use client";

import { usePathname } from "next/navigation";
import { BookmarkIcon } from "~/components/icons/bookmark";
import { FolderIcon } from "~/components/icons/folder";
import { SparkleIcon } from "~/components/icons/sparkle";
import {
  SidebarItem,
  SidebarLabel,
  SidebarSection,
} from "~/components/primitives/sidebar";
import { User } from "~/server/db/schema";

type SideNavigationProps = {
  user: User | null;
};

export function SidebarNavigation({ user }: SideNavigationProps) {
  let pathname = usePathname();

  return (
    <>
      <SidebarSection>
        <SidebarItem
          href="/discover"
          current={pathname.startsWith("/discover")}
        >
          <SparkleIcon className="size-5" />
          <SidebarLabel>Discover</SidebarLabel>
        </SidebarItem>
        {/* <SidebarItem href="/search" current={pathname.startsWith("/search")}>
          <SearchIcon width={20} height={20} />
          <SidebarLabel>Search</SidebarLabel>
        </SidebarItem> */}
        {user && (
          <>
            <SidebarItem
              href="/dashboard"
              current={pathname.startsWith("/dashboard")}
            >
              <BookmarkIcon width={20} height={20} />
              <SidebarLabel>Bookmarks</SidebarLabel>
            </SidebarItem>
            <SidebarItem
              href="/collection"
              current={pathname.startsWith("/collection")}
            >
              <FolderIcon className="size-5" />
              <SidebarLabel>Collections</SidebarLabel>
            </SidebarItem>
          </>
        )}
      </SidebarSection>
    </>
  );
}
