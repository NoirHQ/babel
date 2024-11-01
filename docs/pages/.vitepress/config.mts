import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Babel",
  description: "Universal Protocol Translator",
  locales: {
    root: {
      label: 'English',
      lang: 'en',

      themeConfig: {
        nav: [
          { text: 'Home', link: '/' },
          { text: 'Learn', link: '/learn' },
          { text: 'Use', link: '/use' },
          { text: 'Build', link: '/build' }
        ],

        sidebar: {
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
    },
    kr: {
      label: 'Korean',
      lang: 'ko',
      link: '/ko',
      themeConfig: {
        nav: [
          { text: 'Home', link: '/ko' },
          { text: 'Learn', link: '/ko/learn' },
          { text: 'Use', link: '/ko/use' },
          { text: 'Build', link: '/ko/build' }
        ],

        sidebar: {
          '/ko/learn/': [
            {
              text: 'Basics', items: [
                { text: 'What is Babel?', link: '/ko/learn/basics/what-is-babel' },
                { text: 'Why we need Babel', link: '/ko/learn/basics/why-we-need-babel' }
              ]
            },
            {
              text: 'Advanced', items: [
                { text: 'Unified Account', link: '/ko/learn/advanced/unified-account' },
                { text: 'Multi VM', link: '/ko/learn/advanced/multi-vm' },
                { text: 'Cross-Protocol Transaction', link: '/ko/learn/advanced/cross-protocol-transaction' }
              ]
            }
          ],
          '/ko/use/': [
            {
              text: 'Tutorial',
              items: [
                { text: 'Ziggurat Testnet', link: '/ko/use/tutorial/ziggurat-testnet' }
              ]
            },
            {
              text: 'Wallet',
              link: '/ko/use/wallet'
            }
          ],
          '/ko/build/': [
            {
              text: 'Examples',
              items: [
                { text: 'Markdown Examples', link: '/ko/markdown-examples' },
                { text: 'Runtime API Examples', link: '/ko/api-examples' }
              ]
            }
          ]
        },
        socialLinks: [
          { icon: 'github', link: 'https://github.com/noirhq/babel' }
        ]
      }
    }
  }

})
