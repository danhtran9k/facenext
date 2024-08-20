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

TODO:
Đang có vấn đề với logic mention
-> mention xem như là text -> vậy khi user-update rename thì text cũ ko update
=> sẽ gọi fail user-info

Logic bookmark và infinity bookmark cũng ko khớp nhau
Nếu cố gắng setQueriesData thì dễ dup data do BE paginate, vì ko biết data mới sẽ push ntn
(đẹp nhất là sort theo ngày bookmark, tuy nhiên logic thực tế có thể lại sort theo post bt)
=> ko biết chắc và khả năng phải data lớn mới test hết case được
=> tạm skip vì mất quá nhiều thời gian vào logic business ko cần thiết lúc này

TODO:
refactor react-query key ra khu vực api hết
đổi tên hook thành .hook

TODO:
Refactor prisma pagination
Tùy orderBy mà các return khác nhau, ngoài ra có thể khác biệt về trường dùng orderBy
=> consider có nên refactor hay ko

```ts
      orderBy: {
        createdAt: "desc",
      },
      take: pageSize + 1,
      cursor: cursor ? { id: cursor } : undefined,

const nextCursor =
      notifications.length > pageSize ? notifications[pageSize].id : null;

```
