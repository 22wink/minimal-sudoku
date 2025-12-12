/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 如果部署到 GitHub Pages 子路径，需要设置 basePath
  // 使用环境变量 GITHUB_REPOSITORY 来动态获取仓库名，或者直接设置
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  assetPrefix: process.env.NEXT_PUBLIC_BASE_PATH || '',
  output: 'export',
  trailingSlash: true,
}

export default nextConfig
