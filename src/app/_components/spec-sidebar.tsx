"use client";

import { ChevronDown, FileText, Loader2, Plus } from "lucide-react";
import { usePathname } from "next/navigation";

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
import Link from "next/link";

export function SpecSidebar() {
  const pathname = usePathname();

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
        <div className="px-3 py-4">
          <SidebarMenuButton
            asChild
            className=" w-full h-11 justify-start gap-3 bg-primary/5 border border-primary/20 hover:border-primary/40 hover:bg-primary/10 transition-all duration-300 shadow-sm"
            tooltip="Create New Spec"
          >
            <Link href="/" className="group">
              <div className="flex items-center justify-center size-6 rounded-md bg-primary text-primary-foreground transition-transform duration-300 group-hover:rotate-90 group-hover:scale-110">
                <Plus className="size-4" />
              </div>
              <span className="font-bold tracking-tight text-primary/90 transition-colors group-hover:text-primary">
                New Spec
              </span>
            </Link>
          </SidebarMenuButton>
        </div>
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
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === `/${spec.id}`}
                      tooltip={spec.title}
                      className="group py-6 transition-all duration-200 hover:bg-accent/50"
                    >
                      <Link href={`/${spec.id}`}>
                        <FileText className="shrink-0 text-primary/70 group-hover:text-primary" />
                        <div className="flex min-w-0 flex-col gap-0.5">
                          <span className="truncate font-medium md:w-[200px] w-[230px]">{spec.title}</span>
                          <span className="text-muted-foreground/60 text-[10px] uppercase tracking-wider font-semibold">
                            {new Date(spec.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                      </Link>
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
