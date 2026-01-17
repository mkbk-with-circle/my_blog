<template>
  <div v-if="item" class="detail-container">
    <div class="q-section">
      <h3 class="q-title">提问：{{ item.title }}</h3>
      <p class="content">{{ item.content }}</p>
      <!-- 修改点 1: 图片地址去掉 localhost，改为相对路径 /api -->
      <img v-if="item.image_url" v-bind:src="'/api' + item.image_url" class="q-img" />
    </div>
    <div class="a-section">
      <div class="a-label">马卡巴卡的回复：</div>
      <p class="answer">{{ item.answer }}</p>
      <div class="date">{{ formatFullDate(item.answered_at) }}</div>
    </div>
  </div>
  <div v-else-if="error" class="error-msg">{{ error }}</div>
  <div v-else class="loading-msg">加载中...</div>
</template>

<script>
export default {
  data: function() {
    return { item: null, error: '' }
  },
  mounted: function() {
    var params = new URLSearchParams(window.location.search);
    var id = params.get('id');
    if (!id) {
      this.error = '缺少参数';
      return;
    }

    var self = this;
    // 修改点 2: 接口地址去掉 http://localhost:8787
    fetch('/api/questions/detail/' + id)
      .then(function(res) {
        if (res.ok) return res.json();
        throw new Error('提问不存在或尚未回复');
      })
      .then(function(data) {
        self.item = data;
      })
      .catch(function(err) {
        self.error = err.message || '加载失败';
      });
  },
  methods: {
    formatFullDate: function(dateStr) {
      return new Date(dateStr).toLocaleString();
    }
  }
}
</script>

<style scoped>
.detail-container { border: 1px solid #eaecef; border-radius: 8px; overflow: hidden; margin-top: 20px; color: #2c3e50; }
.q-section { padding: 20px; background: #f9f9f9; }
.q-title { margin-top: 0; color: #34495e; }
.a-section { padding: 20px; border-top: 2px solid #3eaf7c; background: #fff; }
.a-label { font-weight: bold; color: #3eaf7c; margin-bottom: 10px; }
.q-img { max-width: 100%; border-radius: 4px; margin-top: 10px; border: 1px solid #eee; }
.content, .answer { line-height: 1.6; white-space: pre-wrap; margin: 0; }
.date { font-size: 0.8em; color: #999; margin-top: 15px; text-align: right; }
.error-msg, .loading-msg { padding: 20px; text-align: center; color: #999; }
</style>