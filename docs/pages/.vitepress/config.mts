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
              text: 'Components',
              items: [
                { text: 'Address', link: '/learn/address' },
                { text: 'Unified Account', link: '/learn/unified-account' },
                { text: 'Multi VM', link: '/learn/multi-vm' },
                { text: 'Cross-Protocol Transaction', link: '/learn/cross-protocol-transaction' }
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
    ko: {
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
              text: '구성 요소', items: [
                { text: '주소', link: '/ko/learn/address' },
                { text: '통합 계정', link: '/ko/learn/unified-account' },
                { text: 'Multi VM', link: '/ko/learn/multi-vm' },
                { text: 'Cross-Protocol Transaction', link: '/ko/learn/cross-protocol-transaction' }
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
