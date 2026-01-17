<template>
  <div v-if="item" class="detail-container">
    <div class="q-section">
      <div class="label-tag q-tag">提问</div>
      <h3 class="q-title">{{ item.title }}</h3>
      <p class="content">{{ item.content }}</p>
      <img v-if="item.image_url" v-bind:src="'/api' + item.image_url" class="q-img" />
    </div>

    <div class="a-section">
      <div class="label-tag a-tag">马卡巴卡的回复</div>
      <p class="answer">{{ item.answer }}</p>
      <div class="footer-info">
        <span class="date">{{ formatFullDate(item.answered_at) }}</span>
        <a v-on:click="$router.back()" style="cursor:pointer" class="back-btn">← 返回列表</a>
      </div>
    </div>
  </div>
  <div v-else-if="error" class="status-msg error">{{ error }}</div>
  <div v-else class="status-msg">加载中...</div>
</template>

<script>
export default {
  data: function() {
    return {
      item: null,
      error: '',
      loading: false
    }
  },

  // 第一次进入路由时触发（客户端跳转也能保证拿到 query）
  beforeRouteEnter: function(to, from, next) {
    next(function(vm) {
      vm.loadByRoute(to)
    })
  },

  // 在同一个组件实例内，路由参数变化时触发（不依赖 mounted）
  beforeRouteUpdate: function(to, from, next) {
    this.loadByRoute(to)
    next()
  },

  // 兜底：有些情况下 mounted 比路由就绪早，mounted 再跑一次
  mounted: function() {
    this.loadByRoute(this.$route)
  },

  methods: {
    getIdFromRoute: function(route) {
      // Vue Router query
      var id = route && route.query ? route.query.id : null
      if (id) return id

      // 兜底：从 location.search 再取一次，防止 VuePress 某些 hydration 时序问题
      try {
        return new URLSearchParams(window.location.search).get('id')
      } catch (e) {
        return null
      }
    },

    loadByRoute: function(route) {
      var id = this.getIdFromRoute(route)
      if (!id) {
        this.item = null
        this.error = '缺少参数 id'
        return
      }
      this.fetchData(id)
    },

    fetchData: function(id) {
      var self = this
      self.loading = true
      self.error = ''
      self.item = null

      fetch('/api/questions/detail/' + id)
        .then(function(res) {
          if (res.ok) return res.json()
          throw new Error('提问不存在或尚未回复')
        })
        .then(function(data) {
          self.item = data
        })
        .catch(function(err) {
          self.error = (err && err.message) ? err.message : '加载失败'
        })
        .finally(function() {
          self.loading = false
        })
    }
  }
}
</script>

<style scoped>
/* 样式保持不变 ... */
.detail-container {
  width: 100%;
  margin-top: 20px;
  background: rgba(30, 30, 30, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  overflow: hidden;
  color: #fff;
}
.q-section { padding: 30px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); }
.a-section { padding: 30px; background: rgba(255, 255, 255, 0.03); }
.label-tag { display: inline-block; padding: 2px 10px; border-radius: 4px; font-size: 0.8em; margin-bottom: 15px; font-weight: bold; }
.q-tag { background: rgba(255, 255, 255, 0.2); color: #fff; }
.a-tag { background: #3eaf7c; color: #fff; }
.q-title { margin: 0 0 15px 0; font-size: 1.5em; }
.content, .answer { line-height: 1.8; white-space: pre-wrap; margin: 0; font-size: 1.1em; color: rgba(255, 255, 255, 0.9); }
.q-img { max-width: 100%; border-radius: 8px; margin-top: 20px; border: 1px solid rgba(255, 255, 255, 0.1); }
.footer-info { margin-top: 30px; display: flex; justify-content: space-between; align-items: center; }
.date { font-size: 0.85em; color: rgba(255, 255, 255, 0.5); }
.back-btn { color: #3eaf7c; text-decoration: none; font-weight: 500; }
.status-msg { padding: 40px; text-align: center; color: #fff; }
</style>