<template>
  <div class="list-container">
    <div v-if="loading" class="status-msg">加载中...</div>
    <div v-else-if="list.length === 0" class="status-msg">还没有已回复的提问哦~</div>
    <div v-else class="stack">
      <div v-for="item in list" v-bind:key="item.id" class="card" v-on:click="goDetail(item.id)">
        <div class="card-header">
          <div class="card-title">{{ item.title }}</div>
          <div class="card-date">{{ formatDate(item.answered_at) }}</div>
        </div>
        <!-- 显示部分内容，使高度随内容变化 -->
        <div class="card-body">
          {{ item.content }}
        </div>
        <div class="card-footer">
          查看详情 →
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
      window.location.href = '/box/q.html?id=' + id;
    }
  }
}
</script>

<style scoped>
.list-container {
  width: 100%;
  margin-top: 20px;
}

/* 改为垂直堆叠布局，占据整栏宽度 */
.stack {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.card {
  width: 100%;
  box-sizing: border-box;
  padding: 20px;
  /* 背景完全透明 */
  background: transparent;
  /* 明显的边界线：使用半透明白色或浅灰色 */
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  /* 确保高度随内容撑开 */
  height: auto;
}

/* 悬停效果：边框变亮，微弱的背景感 */
.card:hover {
  border-color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.05);
  transform: translateY(-3px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 8px;
}

.card-title {
  font-size: 1.2em;
  font-weight: bold;
  color: #fff; /* 假设背景较深，使用白色文字 */
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.card-date {
  font-size: 0.85em;
  color: rgba(255, 255, 255, 0.6);
}

.card-body {
  font-size: 1em;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.9);
  word-break: break-all;
  white-space: pre-wrap;
  margin-bottom: 10px;
}

.card-footer {
  font-size: 0.9em;
  color: #3eaf7c;
  text-align: right;
  font-weight: 500;
}

.status-msg {
  text-align: center;
  color: #fff;
  padding: 40px;
}
</style>