//@ts-nocheck
import { useState } from "react";
import useLogout from "@/hooks/useLogOut";
import { Link, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronRight, ChevronUp } from "lucide-react";
import type { Role } from "@/types/types";
import { menuConfig } from "@/lib/menu-config";
import { useAuthContext } from "@/hooks/useAuthContext";
import { useSocket } from "@/hooks/useSocketContext"; // Updated import

const MACHINE_ID_BY_TITLE: Record<string, string> = {
  "Preform Maker": "MACHINE001",
  "Blow Molder": "MACHINE002",
  "Filler Capper": "MACHINE003",
};

function Navbar() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const role: Role = user?.role;
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  
  // Use the combined socket context
  const { isMachineOn, totalActiveMachines } = useSocket();

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const currentGroups = menuConfig[role] || [];

  const getMachineStatus = (title: string) => {
    const id = MACHINE_ID_BY_TITLE[title];
    if (!id) return null;
    return isMachineOn(id) ? "ON" : "";
  };

  return (
    <Sidebar>
      <SidebarContent>
        {currentGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const itemKey = `${group.label}-${item.title}`;
                  const isOpen = openItems[itemKey];

                  if (item.subItems && item.subItems.length > 0) {
                    return (
                      <Collapsible
                        key={item.title}
                        open={isOpen}
                        onOpenChange={() => toggleItem(itemKey)}
                        className="group/collapsible"
                      >
                        <SidebarMenuItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton>
                              <item.icon />
                              <span className="font-bold text-sm">
                                {item.title === "Machines" ? (
                                  <>
                                    {item.title}
                                    <span className="bg-primary px-1 pt-[1px] rounded inline-block ml-2 text-[10px] text-white">
                                      {totalActiveMachines}
                                    </span>
                                  </>
                                ) : (
                                  item.title
                                )}
                              </span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.subItems.map((subItem) => (
                                <SidebarMenuSubItem key={subItem.title}>
                                  <SidebarMenuSubButton asChild>
                                    <Link to={subItem.url}>
                                      <subItem.icon className="h-4 w-4" />
                                      <span className="flex items-center gap-2">
                                        {subItem.title}

                                        {MACHINE_ID_BY_TITLE[subItem.title] && (
                                          <span
                                            className={`text-[10px] px-1 pt-[3px] rounded 
                                            ${getMachineStatus(subItem.title) === "ON" 
                                              ? "bg-primary text-white" 
                                              : ""}`}
                                          >
                                            {getMachineStatus(subItem.title)}
                                          </span>
                                        )}
                                      </span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuItem>
                      </Collapsible>
                    );
                  }

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-auto py-2">
                  <Avatar>
                    <AvatarImage src={user?.photo} />
                    <AvatarFallback>
                      {user?.name[0] + user?.name[1]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-sm font-medium">{user?.name}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronUp className="ml-auto shrink-0" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56">
                 <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault();
                    logout();
                    navigate("/login");
                  }}
                  className="cursor-pointer"
                >
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default Navbar;