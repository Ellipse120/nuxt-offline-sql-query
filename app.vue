<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  CircleUser,
  Menu,
  SunMoon,
  Search,
  DatabaseBackup,
} from "lucide-vue-next";

const colorMode = useColorMode();
</script>

<template>
  <div class="flex min-h-screen w-full flex-col">
    <header
      class="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6"
    >
      <nav
        class="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6"
      >
        <NuxtLink
          to="/"
          class="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <DatabaseBackup class="h-6 w-6" />
          <span class="sr-only">Offline SQL Query App</span>
        </NuxtLink>
        <NuxtLink
          to="/"
          class="text-muted-foreground transition-colors hover:text-foreground"
        >
          Home
        </NuxtLink>
        <NuxtLink
          href="/playground"
          class="text-muted-foreground transition-colors hover:text-foreground"
        >
          Playground
        </NuxtLink>
        <NuxtLink
          href="/dashboard"
          class="text-muted-foreground transition-colors hover:text-foreground"
        >
          Dashboard
        </NuxtLink>
      </nav>
      <Sheet>
        <SheetTrigger as-child>
          <Button variant="outline" size="icon" class="shrink-0 md:hidden">
            <Menu class="h-5 w-5" />
            <span class="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav class="grid gap-6 text-lg font-medium">
            <NuxtLink
              to="/"
              class="flex items-center gap-2 text-lg font-semibold"
            >
              <DatabaseBackup class="h-6 w-6" />
              <span class="sr-only">Offline SQL Query App</span>
            </NuxtLink>
            <NuxtLink to="/" class="hover:text-foreground"> Home </NuxtLink>
            <NuxtLink to="/playground" class="hover:text-foreground">
              Playground
            </NuxtLink>
            <NuxtLink to="/dashboard" class="hover:text-foreground">
              Dashboard
            </NuxtLink>
          </nav>
        </SheetContent>
      </Sheet>
      <div class="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form class="ml-auto flex-1 sm:flex-initial">
          <div class="relative">
            <Search
              class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            />
            <Input
              type="search"
              placeholder="Search products..."
              class="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="rounded-full">
              <SunMoon class="h-5 w-5" />
              <span class="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem @click="colorMode.preference = 'light'">
              Light
            </DropdownMenuItem>
            <DropdownMenuItem @click="colorMode.preference = 'dark'">
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem @click="colorMode.preference = 'system'">
              System
            </DropdownMenuItem>
            <DropdownMenuItem @click="colorMode.preference = 'sepia'">
              Sepia
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="secondary" size="icon" class="rounded-full">
              <CircleUser class="h-5 w-5" />
              <span class="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <NuxtPage />
    </main>
  </div>
</template>
