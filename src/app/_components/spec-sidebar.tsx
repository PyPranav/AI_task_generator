"use client";

import { ChevronDown, FileText, Loader2 } from "lucide-react";

import { api } from "~/trpc/react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarRail,
} from "~/components/ui/sidebar";
import { ScrollArea } from "~/components/ui/scroll-area";

export function SpecSidebar() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    api.spec.list.useInfiniteQuery(
      { limit: 5 },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  const specs = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <Sidebar>
      <SidebarHeader>
        <span className="px-2 text-sm font-semibold">Task Generator</span>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="flex-1">
          <SidebarGroup>
            <SidebarGroupLabel>Previous Specs</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {isLoading &&
                  Array.from({ length: 3 }).map((_, i) => (
                    <SidebarMenuItem key={i}>
                      <SidebarMenuSkeleton />
                    </SidebarMenuItem>
                  ))}

                {!isLoading && specs.length === 0 && (
                  <p className="text-muted-foreground px-2 py-4 text-center text-xs">
                    No specs yet
                  </p>
                )}

                {specs.map((spec) => (
                  <SidebarMenuItem key={spec.id}>
                    <SidebarMenuButton tooltip={spec.title}>
                      <FileText className="shrink-0" />
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate">{spec.title}</span>
                        <span className="text-muted-foreground text-xs">
                          {new Date(spec.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                {hasNextPage && (
                  <li className="px-2 py-1">
                    <button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                      className="text-muted-foreground hover:text-foreground flex w-full items-center justify-center gap-1 py-1 text-xs transition-colors"
                    >
                      {isFetchingNextPage ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <>
                          <span>Load more</span>
                          <ChevronDown className="size-3" />
                        </>
                      )}
                    </button>
                  </li>
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
