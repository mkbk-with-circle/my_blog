<template>
  <div class="list-container">
    <div v-if="loading" class="status-msg">加载中...</div>
    <div v-else-if="list.length === 0" class="status-msg">还没有已回复的提问哦~</div>

    <div v-else class="stack">
      <div
        v-for="item in list"
        v-bind:key="item.id"
        class="card"
        v-on:click="goDetail(item.id)"
        role="button"
        tabindex="0"
      >
        <div class="card-info">
          <div class="card-title" v-bind:title="item.content">{{ item.content }}</div>
          <div class="card-date">{{ formatDate(item.answered_at) }}</div>
        </div>

        <div class="card-arrow">
          <span class="card-arrow-text">查看详情</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return { list: [], loading: true }
  },
  mounted: function() {
    var self = this;
    fetch('/api/questions/public')
      .then(function(res) { return res.json(); })
      .then(function(data) { self.list = data; })
      .catch(function(err) { console.error(err); })
      .finally(function() { self.loading = false; });
  },
  methods: {
    formatDate: function(dateStr) {
      return new Date(dateStr).toLocaleDateString();
    },
    goDetail: function(id) {
      var path = this.$withBase('/pages/01a4c3/')

      // 保持原逻辑：优先用 vue-router 带 query 跳转
      try {
        if (this.$router && this.$router.push) {
          this.$router.push({ path: path, query: { id: id } })
          return
        }
      } catch (e) {
        // ignore and fallback
      }

      // 兜底：如果路由不可用/跳转失败，用原生跳转，保证 id 一定带上
      window.location.href = path + '?id=' + encodeURIComponent(String(id))
    }
  }
}
</script>

<style scoped>
.list-container {
  width: 100%;
  margin-top: 20px;
}

.stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card {
  width: 100%;
  box-sizing: border-box;
  padding: 18px 24px;

  background: rgba(30, 30, 30, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  background: rgba(50, 50, 50, 0.8);
  border-color: #3eaf7c;
  transform: translateX(4px);
}

.card-info {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.card-title {
  font-size: 1.15em;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);

  white-space: normal;
  overflow: visible;
  text-overflow: clip;

  overflow-wrap: anywhere;
  word-break: break-word;
}

.card-date {
  font-size: 0.85em;
  color: rgba(255, 255, 255, 0.5);
}

.card-arrow {
  flex: 0 0 auto;
  width: 96px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;

  color: #3eaf7c;
  font-size: 0.9em;
  font-weight: 500;
  opacity: 0.8;
  transition: opacity 0.3s;
  white-space: nowrap;
}

.card:hover .card-arrow {
  opacity: 1;
}

.card-arrow-text {
  line-height: 1;
}

.status-msg {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  padding: 40px;
  background: rgba(0,0,0,0.2);
  border-radius: 12px;
}
</style>
