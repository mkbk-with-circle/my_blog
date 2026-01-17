<template>
  <div class="list-container">
    <div v-if="loading" class="status-msg">加载中...</div>
    <div v-else-if="list.length === 0" class="status-msg">还没有已回复的提问哦~</div>
    <div v-else class="stack">
      <div v-for="item in list" v-bind:key="item.id" class="card" v-on:click="goDetail(item.id)">
        <div class="card-info">
          <div class="card-title">{{ item.title }}</div>
          <div class="card-date">{{ formatDate(item.answered_at) }}</div>
        </div>
        <div class="card-arrow">
          <span>查看详情</span>
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
      // 跳转到 q.md 的 permalink：/pages/01a4c3/
      // 用 $withBase 兼容 base 路径部署
      var path = this.$withBase('/pages/01a4c3/')
      this.$router.push({ path: path, query: { id: id } })
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
  /* 关键修改：深色半透明底色 */
  background: rgba(30, 30, 30, 0.6);
  /* 关键修改：毛玻璃效果，让背景模糊，文字更清晰 */
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);

  /* 细边框 */
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;

  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  background: rgba(50, 50, 50, 0.8);
  border-color: #3eaf7c;
  transform: translateX(4px); /* 悬停时向右微动，增加交互感 */
}

.card-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-title {
  font-size: 1.15em;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0,0,0,0.5);
}

.card-date {
  font-size: 0.85em;
  color: rgba(255, 255, 255, 0.5);
}

.card-arrow {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #3eaf7c;
  font-size: 0.9em;
  font-weight: 500;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.card:hover .card-arrow {
  opacity: 1;
}

.status-msg {
  text-align: center;
  color: rgba(255, 255, 255, 0.7);
  padding: 40px;
  background: rgba(0,0,0,0.2);
  border-radius: 12px;
}
</style>
