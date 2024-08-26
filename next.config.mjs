/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    staleTimes: {
      dynamic: 30,
    },
  },
  // https://github.com/lucia-auth/examples/blob/main/nextjs-app/username-and-password/next.config.js
  // https://lucia-auth.com/guides/email-and-password/basics
  // có đề cập tên thư viện nhưng trong docs setup ko thấy nói
  // check trong example có
  // https://lucia-auth.com/tutorials/username-and-password/nextjs-app
  serverExternalPackages: ["@node-rs/argon2"],
  images: {
    remotePatterns: [
      // https://docs.uploadthing.com/working-with-files#accessing-files
      // Next sẽ resize ảnh nhưng tốn server compute, TÙY HOSTING sẽ free hay tính phí khác nhau -> phải set pathname của riêng app mình
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/*`,
      },
    ],
  },
  // https://nextjs.org/docs/pages/api-reference/next-config-js/rewrites
  rewrites: () => {
    return [
      {
        source: "/hashtag/:tag",
        // %23: -> # escape HTML
        destination: "/search?q=%23:tag",
      },
    ];
  },
};

export default nextConfig;
