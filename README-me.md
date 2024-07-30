# Project & IDE setup (create-next-app, Shadcn UI, Prettier Tailwind plugin, Prisma, extensions)

> Coding in Flow channel

## Features and technologies:

-Next.js 15
-Server actions and server components
-TanStack React Query
-Optimistic updates
-Infinite scrolling feeds
-File uploads with drag & drop and copy-paste support (UploadThing)
-Like system
-Follow system
-Comment system
-Notification system
-DM system (powered by Stream)
-Bookmarks
-Lucia authentication (username/password & Google OAuth2)
-Postgres DB with Prisma ORM
-Hashtags & mentions
-Full-text search
-Advanced caching & revalidation
-Mobile-responsive layout with Tailwind CSS & Shadcn UI components
-Dark theme, light theme, and system theme
-Real-time form validation with React Hook Form & Zod
-TipTap editor
-Deploy on Vercel & set up cron job
-IDE setup with Prettier & plugins

## Ref src

`https://github.com/codinginflow/nextjs-15-social-media-app`

## Init src command

For custom init - check git commit

```bash
# Init
npx create-next-app@rc

# SETUP
# Dependencies install command:
npm i lucia @lucia-auth/adapter-prisma prisma @prisma/client @tanstack/react-query @tanstack/react-query-devtools @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/pm uploadthing @uploadthing/react arctic date-fns ky next-themes react-cropper react-image-file-resizer react-intersection-observer react-linkify-it stream-chat stream-chat-react zod --legacy-peer-deps

# Dev dependencies install command:
npm i -D prettier eslint-config-prettier prettier-plugin-tailwindcss --legacy-peer-deps

# Shadcn components add command:
npx --legacy-peer-deps shadcn-ui@latest init
npx --legacy-peer-deps shadcn-ui@latest add button dialog dropdown-menu form input label skeleton tabs textarea toast tooltip


# ========================================
# re-init from git clone
# ========================================
npm i --legacy-peer-deps
# ========================================

```

# Setup editor

Quick suggestion -> string - cho tailwind suggest
install Dev - dependency + Prisma extension + Eslint

## Setup and deploy db

Vercel > storage > Postgres
Create, copy env local

```bash
npx prisma init

# update /prisma/schema.prisma db
npx prisma db push

```

## My setup project

```bash
npm i -D --legacy-peer-deps eslint-plugin-import

```
