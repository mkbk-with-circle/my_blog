<template>
  <div class="detail-wrap" v-bind:key="routeKey">
    <div v-if="loading" class="status-msg">加载中...</div>
    <div v-else-if="error" class="status-msg error">{{ error }}</div>

    <div v-else-if="item" class="detail-container">
      <div class="q-section">
        <div class="label-tag q-tag">提问</div>
        <!-- 只显示问题内容 -->
        <p class="content">{{ item.content }}</p>
        <img v-if="item.image_url" v-bind:src="'/api' + item.image_url" class="q-img" />
      </div>

      <div class="a-section">
        <div class="label-tag a-tag">玛卡巴卡的回复</div>
        <p class="answer">{{ item.answer }}</p>
        <div class="footer-info">
          <span class="date">{{ formatFullDate(item.answered_at) }}</span>
          <a v-on:click="$router && $router.back ? $router.back() : history.back()" class="back-btn">← 返回</a>
        </div>
      </div>
    </div>

    <div v-else class="status-msg error">未加载到数据</div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      item: null,
      error: '',
      loading: true
    }
  },

  computed: {
    // 用 fullPath 做 key，路由（含 query）变化就强制刷新整块 DOM
    routeKey: function() {
      return (this.$route && this.$route.fullPath) ? this.$route.fullPath : String(Date.now())
    }
  },

  watch: {
    // 关键：监听 fullPath（包含 query），保证点击不同详情一定触发
    '$route.fullPath': {
      immediate: true,
      handler: function() {
        this.load()
      }
    }
  },

  methods: {
    getId: function() {
      // 优先 Vue Router 的 query
      var id = this.$route && this.$route.query ? this.$route.query.id : null
      if (id) return id

      // 兜底：直接从 URL 取
      try {
        return new URLSearchParams(window.location.search).get('id')
      } catch (e) {
        return null
      }
    },

    load: function() {
      var id = this.getId()
      this.item = null
      this.error = ''
      this.loading = true

      if (!id) {
        this.error = '缺少参数 id'
        this.loading = false
        return
      }

      var self = this
      fetch('/api/questions/detail/' + id, { cache: 'no-store' })
        .then(function(res) {
          if (!res.ok) throw new Error('接口返回 ' + res.status)
          return res.json()
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
    },

    formatFullDate: function(dateStr) {
      return new Date(dateStr).toLocaleString()
    }
  }
}
</script>

<style scoped>
.detail-wrap { width: 100%; margin-top: 20px; }
.detail-container {
  width: 100%;
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
.back-btn { color: #3eaf7c; text-decoration: none; font-weight: 500; cursor: pointer; }
.status-msg {
  padding: 40px;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(30, 30, 30, 0.6);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.status-msg.error { color: #ff6b6b; }
</style>