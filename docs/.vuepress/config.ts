/**
 * 提示：如您想使用JS版本的配置文件可参考：https://github.com/xugaoyi/vuepress-theme-vdoing/tree/a2f03e993dd2f2a3afdc57cf72adfc6f1b6b0c32/docs/.vuepress
 */
import { resolve } from 'path'
import { defineConfig4CustomTheme, UserPlugins } from 'vuepress/config'
import { VdoingThemeConfig } from 'vuepress-theme-vdoing/types'
import dayjs from 'dayjs'
// import baiduCode from './config/baiduCode' // 如果不用百度统计可以先注释
import htmlModules from './config/htmlModules' 

const DOMAIN_NAME = 'mkbk-pku.cn' // 域名
const WEB_SITE = `http://${DOMAIN_NAME}` 

export default defineConfig4CustomTheme<VdoingThemeConfig>({
  theme: 'vdoing', 

  locales: {
    '/': {
      lang: 'zh-CN',
      title: "玛卡巴卡的blog",
      description: '网络技术分享，自传，笨蛋日记，自己开发的小程序，还有一些生活杂谈~~~',
    }
  },

  // 主题配置
  themeConfig: {
    // 导航配置（已根据你删除后的目录进行了精简）
    nav: [
      { text: '首页', link: '/' },
      {
        text: '索引',
        link: '/archives/',
        items: [
          { text: '分类', link: '/categories/' },
          { text: '标签', link: '/tags/' },
          { text: '归档', link: '/archives/' },
        ],
      },
      { text: '关于', link: '/about/' },

    ],
    sidebarDepth: 2, 
    logo: '/img/logo.png', 
    buttonHideCategory: false, // 是否隐藏分类按钮
    // repo: 'your-github/blog', // 建议换成你自己的 Github 仓库地址
    searchMaxSuggestions: 10, 
    lastUpdated: '上次更新', 
    docsDir: 'docs', 
    editLinks: true, 
    editLinkText: '编辑',

    //*** Vdoing 主题相关配置 ***//
    sidebar: 'structuring', // 核心功能：自动生成侧边栏

    // 文章默认的作者信息
    author: {
      name: '玛卡巴卡', 
    },

    // 博主信息 (显示在首页侧边栏)
    blogger: {
      avatar: '/img/girl.jpg', // 注意：这里直接写 /img/ 开头，不需要写 public
      name: '玛卡巴卡',
      slogan: '短暂的休息，是为了更好的再出发\n有我爱和爱我的人，便什么都不会怕——',
    },

    // 社交图标
    social: {
      icons: [
        {
          iconClass: 'icon-youjian',
          title: '想给我发邮件？',
          link: 'mailto:2200013153@stu.pku.edu.cn',
        },
        {
          iconClass: 'icon-github',
          title: '没啥东西的GitHub()',
          link: 'https://github.com/mkbk-with-circle', // 换成你的 Github
        },
        {
          iconClass: 'icon-erji',
          title: '玛卡巴卡的网易云歌单',
          link: 'https://music.163.com/playlist?id=12761001493&uct2=U2FsdGVkX19e8vqB3vn5caYd4/kYQIkIymRiN8QCCxg=', // 你的网易云歌单
        },
            {
          iconClass: 'icon-qq',
          title: 'QQ联系我',
          link: 'qq:2186431514',
        }
      ],
    },

    // 页脚信息
    footer: {
      createYear: 2026, 
      copyrightInfo:
        '玛卡巴卡 | MIT License', 
    },

    extendFrontmatter: {
      author: {
        name: '玛卡巴卡',
      }
    },
    // htmlModuless
  },

  // 注入到页面<head>中的标签
  head: [
    ['link', { rel: 'icon', href: '/img/favicon.ico' }], 
    ['meta', { name: 'keywords', content: '玛卡巴卡,博客,技术分享' }],
    ['meta', { name: 'theme-color', content: '#11a8cd' }],
    ['script', { src: '/js/click-fireworks.js' }],
  ], 

  // 插件配置
  plugins: <UserPlugins>[
    [
      "sitemap", 
      {
        hostname: WEB_SITE,
      },
    ],

    // 全文搜索插件
    'fulltext-search',

    [
      'one-click-copy', // 代码块复制
      {
        copySelector: ['div[class*="language-"] pre', 'div[class*="aside-code"] aside'],
        copyMessage: '复制成功',
        duration: 1000,
        showInMobile: false,
      },
    ],

    [
      'vuepress-plugin-zooming', // 放大图片
      {
        selector: '.theme-vdoing-content img:not(.no-zoom)',
        options: {
          bgColor: 'rgba(0,0,0,0.6)',
        },
      },
    ],

    // ⚠️ 评论插件建议先注释掉，或者换成自己的 Gitalk 配置，否则评论会发给原作者
    /*
    [
      'vuepress-plugin-comment', 
      {
        choosen: 'gitalk',
        options: {
          clientID: '你的clientID',
          clientSecret: '你的clientSecret',
          repo: '你的仓库名',
          owner: '你的用户名',
          admin: ['你的用户名'],
          pagerDirection: 'last',
          id: '<%- (frontmatter.permalink || frontmatter.to.path).slice(-16) %>',
          title: '「评论」<%- frontmatter.title %>',
          labels: ['Gitalk', 'Comment'],
          body: '页面：<%- window.location.origin + (frontmatter.to.path || window.location.pathname) %>',
        },
      },
    ],
    */

    [
      '@vuepress/last-updated', 
      {
        transformer: (timestamp, lang) => {
          return dayjs(timestamp).format('YYYY/MM/DD, HH:mm:ss')
        },
      },
    ],
  ],

  markdown: {
    lineNumbers: true,
    extractHeaders: ['h2', 'h3', 'h4', 'h5', 'h6'], 
  },

  extraWatchFiles: [
    '.vuepress/config.ts',
  ]
})


