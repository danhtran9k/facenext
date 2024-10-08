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
đổi tên hook thành .hook

# Google OAuth

cloud console -> create prj -> APIs - Services -> OAuth consent screen

External app -> fill vào, skip logo - khỏi verfify phiền
Những trường ko required skip hết, mail thì lấy chính mail đang đăng kí

Scope -> chọn email và profile
Có thể skip test user => vào lại dashboard -> chọn Publish App

## Step 2

Credentials -> create Credentials -> OAuth client Id
Authorized redirect URIS -> multi được, cho local + development riêng ok
http://localhost:[PORT]/api/auth/callback/google

# GetStream chat

phải lên dashboard - disable thread share đi vì ko dùng

Update user profil.mutate -> mutateFn ->
Nếu upload file xong trước -> db update profile đồng thời 2 request cùng lúc ?
Vấn đề db lock lẫn nhau ?

Cùng 1 group user có thể có nhiều group riêng biệt nhau
Mỗi group có thể rename lại
giữa 2 user với nhau nếu muốn tăng độ phức tạp có thể tách riêng option group chat vs single chat
Prj hiện tại đang merge 2 option lại chung, riêng việc tạo group bị limit
=> tạm chấp nhận, hiểu ý tưởng trước

# DEPLOY - VERCEL

nhớ copy env vào -> copy toàn bộ file paste vào, web tự filter ra add đồng thời
Remove PUBLIC_BASE_URL đi

Trước khi bấm Deploy -> check phần Build and Output Settings
-> override lại Install Command
`npm install --legacy-peer-deps`

Chờ Deploy xong click vào Dashboard
Check settings -> check NodeJs >= 20+
Nếu trước đó bản cũ hơn thì phải re-deploy lại

=> deploy xong có URL
=> settings => update thêm env PUBLIC_BASE_URL lại, nhớ có https
=> Tabs Deployments -> re-deploy

Về stream-chat dù đang set ở Dev vẫn xài được ở Production
Tuy nhiên sẽ có sự khác biệt -> check docs
https://getstream.io/chat/docs/react/production_and_development_mode/
-> phải tạo 1 app riêng ra ? (kiểu tách biệt)

<!-- ==================================================== -->

# TODO:

Tạo 1 context ở cấp Post-item -> tuy nhiên vì bọ context nên phải cẩn thận rsc vs client

- Ko phải bị ảnh hưởng hoàn toàn vì có nhiều component bọc trung gian sẽ ko cần truy cập vào props post (post.id)
  -> giúp mọi item bên dưới truy cập được vào post-id, các info của post gốc
  -> tránh props drilling vì component chia nhỏ logic phức tạp

TODO:
Xem xét web-socket thật sự cho noti
NotificationItem - Map nên xem xét lại cách viết
Đang trick vào trang noti -> mark read hết, khá tệ
Thử nghiên cứu cách khác xử lý

Tách hàm setQuery của 1 số react query mutate cũ ra
