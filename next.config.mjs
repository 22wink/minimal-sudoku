/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // 如果部署到 GitHub Pages 子路径，取消注释并设置正确的 basePath
  // basePath: process.env.NODE_ENV === 'production' ? '/minimal-sudoku' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/minimal-sudoku' : '',
  output: 'export',
  trailingSlash: true,
}

export default nextConfig
