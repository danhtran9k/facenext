Features and technologies:
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

22:51 / 7:37:10

•
Project & IDE setup (create-next-app, Shadcn UI, Prettier Tailwind plugin, Prisma, extensions)

🖨️ Transcript Build A Full-Stack Social Media App With Next.js 15 (React Query, Lucia Auth, TypeScript, Tailwind)

Coding in Flow
274K subscribers

Subscribe

1.7K

Share

20,298 views Jul 19, 2024
Build and deploy a full-stack social media app like Twitter or Facebook with Next.js 15.

Features and technologies:
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

```bash
# Init
npx create-next-app@rc

# SETUP
# Dependencies install command:
npm i lucia @lucia-auth/adapter-prisma prisma @prisma/client @tanstack/react-query @tanstack/react-query-devtools @tiptap/react @tiptap/starter-kit @tiptap/extension-placeholder @tiptap/pm uploadthing @uploadthing/react arctic date-fns ky next-themes react-cropper react-image-file-resizer react-intersection-observer react-linkify-it stream-chat stream-chat-react --legacy-peer-deps

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
