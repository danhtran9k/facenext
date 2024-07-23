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
  serverExternalPackages: ["@node-rs/argon2"],
};

export default nextConfig;
