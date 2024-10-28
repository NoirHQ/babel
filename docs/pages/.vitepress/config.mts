import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Babel",
  description: "Universal Protocol Translator",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Learn', link: '/learn' },
      { text: 'Use', link: '/use' },
      { text: 'Build', link: '/build' }
    ],

    sidebar: {
      '/': [
        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/markdown-examples' },
            { text: 'Runtime API Examples', link: '/api-examples' }
          ]
        }
      ],
      '/learn/': [
        {
          text: 'Basics', items: [
            { text: 'What is Babel?', link: '/learn/basics/what-is-babel' },
            { text: 'Why we need Babel', link: '/learn/basics/why-we-need-babel' }
          ]
        },
        {
          text: 'Advanced', items: [
            { text: 'Unified Account', link: '/learn/advanced/unified-account' },
            { text: 'Multi VM', link: '/learn/advanced/multi-vm' },
            { text: 'Cross-Protocol Transaction', link: '/learn/advanced/cross-protocol-transaction' }
          ]
        }
      ],
      '/use/': [
        {
          text: 'Tutorial',
          items: [
            { text: 'Ziggurat Testnet', link: '/use/tutorial/ziggurat-testnet' }
          ]
        },
        {
          text: 'Wallet',
          link: '/use/wallet'
        }
      ],
      '/build/': [
        {
          text: 'Examples',
          items: [
            { text: 'Markdown Examples', link: '/markdown-examples' },
            { text: 'Runtime API Examples', link: '/api-examples' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/noirhq/babel' }
    ]
  }
})
