import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'pixelrest',
  description: 'Developer documentation for the pixelrest framework',
  themeConfig: {
    nav: [
      { text: 'Home',         link: '/' },
      { text: 'Architecture', link: '/architecture' },
      { text: 'Guides',       link: '/guides/service' }
    ],
    sidebar: [
      {
        text: 'Overview',
        items: [
          { text: 'Introduction', link: '/' },
          { text: 'Architecture', link: '/architecture' }
        ]
      },
      {
        text: 'Guides',
        items: [
          { text: 'Service',        link: '/guides/service' },
          { text: 'Schema',         link: '/guides/schema' },
          { text: 'Repository',     link: '/guides/repository' },
          { text: 'Error handling', link: '/guides/error-handling' }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', url: 'https://github.com/pixeltraits/pixelrest' }
    ]
  }
})
