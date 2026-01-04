"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useStore } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, ChevronDown } from "lucide-react"

export function RoleNav() {
  const pathname = usePathname()
  const { currentUser, setCurrentUser, users } = useStore()

  const navItems = [
    { href: "/facilitator", label: "Facilitator", roles: ["admin", "facilitator"] },
    { href: "/participant", label: "Participant", roles: ["admin", "participant"] },
    { href: "/admin", label: "Admin", roles: ["admin"] },
  ]

  const filteredNav = navItems.filter((item) => currentUser && item.roles.includes(currentUser.role))

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold text-green-700">
            DMS Clinical Services
          </Link>
          <nav className="flex items-center gap-4">
            {filteredNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-green-700",
                  pathname.startsWith(item.href) ? "text-green-700" : "text-gray-600",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <User className="h-4 w-4" />
              {currentUser?.name || "Select Role"}
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {users.map((user) => (
              <DropdownMenuItem
                key={user.id}
                onClick={() => setCurrentUser(user)}
                className={cn(currentUser?.id === user.id && "bg-green-50")}
              >
                <span className="font-medium">{user.name}</span>
                <span className="ml-2 text-xs text-gray-500 capitalize">({user.role})</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
