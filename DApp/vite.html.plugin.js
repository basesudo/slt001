import { loadEnv } from 'vite'

const customHtmlPlugin = (mode) => {
  const envObj = loadEnv(mode, process.cwd())

  return {
    name: 'custom-html-plugin',
    transformIndexHtml(html) {
      return generateHtml(html, envObj)
    }
  }
}

const generateHtml = (html, envObj) => {
  // 获取 完整标题
  let title = envObj['VITE_APP_META_TITLE']
  // 获取 平台关键词
  let keywords = envObj['VITE_APP_META_KEYWORDS']
  // 获取 平台描述
  let description = envObj['VITE_APP_META_DESCRIPTION']
  // 获取 当前平台
  // let platform = envObj['VITE_APP_ENV']
  let platform = "dev"
  // 获取 当前版本
  let version = `2.0.${+new Date()}`

  // 替换占位符为实际数据
  return html
    .replace(
      '<head>',
      `
      <head>
      <meta name="keywords" content="${keywords}" /> 
      <meta name="description" content="${description}" />
      <title>${title}</title>
      <meta content="/platform/${platform}/logo.png?${version}" itemprop="image">
      `
    )
    .replace(
      '</head>',
      `

      <meta property="og:image" content="/platform/${platform}/logo_144.png?${version}">
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">

      <link rel="icon" href="./favicon.ico?${version}" type="image/x-icon"/>
      <link rel="bookmark" href="./favicon.ico?${version}" type="image/x-icon">

      <link rel="apple-touch-icon-precomposed" href="/platform/${platform}/logo_57.png?${version}"/>
      <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/platform/${platform}/logo_72.png?${version}"/>
      <link rel="apple-touch-icon-precomposed" sizes="120x120" href="/platform/${platform}/logo_120.png?${version}"/>
      <link rel="apple-touch-icon-precomposed" sizes="144x144" href="/platform/${platform}/logo_144.png?${version}"/>
      
      </head>

      <script>
        Object.defineProperty(window, '_APP_VERSION', {
          value: '${version}',
          writable: false,
          configurable: false
        });
        function addLink(rel, href) {
          const domLink = document.createElement('link');
          domLink.rel = rel;
          domLink.href = href;
          document.head.appendChild(domLink);
        }
        function addMeta(name, content) {
          const domMeta = document.createElement('meta');
          domMeta.name = name;
          domMeta.content = content;
          document.head.appendChild(domMeta);
        }

        [
          {
            name: 'copyright',
            content: \`© \${new Date().getFullYear()} \${location.host}\`
          },
        ].forEach((elem) => addMeta(elem.name, elem.content));
        
        [
          {
            rel: 'dns-prefetch',
            href: \`//api.\${location.host}\`
          },
          {
            rel: 'preconnect',
            href: \`//api.\${location.host}\`
          }
        ].forEach((elem) => addLink(elem.rel, elem.href));
      </script>
     `.replace(/[\n]+/g, '')
    )
}

export { customHtmlPlugin }
