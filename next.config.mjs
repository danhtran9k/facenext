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
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/a/<APP_ID>/*",
      },
    ],
  },
};

export default nextConfig;
