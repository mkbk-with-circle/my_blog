export default ({ isServer }) => {
  if (!isServer) {
    // 页面加载后创建背景容器
    window.addEventListener('load', () => {
      const bgDiv = document.createElement('div')
      bgDiv.id = 'dynamic-background'
      document.body.appendChild(bgDiv)
    })
  }
}
