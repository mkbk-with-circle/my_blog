<template>
  <div v-if="item" class="detail-container">
    <!-- 提问部分 -->
    <div class="q-section">
      <div class="label-tag q-tag">提问</div>
      <h3 class="q-title">{{ item.title }}</h3>
      <p class="content">{{ item.content }}</p>
      <img v-if="item.image_url" v-bind:src="'/api' + item.image_url" class="q-img" />
    </div>

    <!-- 回复部分 -->
    <div class="a-section">
      <div class="label-tag a-tag">玛卡巴卡的回复</div>
      <p class="answer">{{ item.answer }}</p>
      <div class="footer-info">
        <span class="date">{{ formatFullDate(item.answered_at) }}</span>
        <a href="javascript:history.back()" class="back-btn">← 返回列表</a>
      </div>
    </div>
  </div>
  <div v-else-if="error" class="status-msg error">{{ error }}</div>
  <div v-else class="status-msg">加载中...</div>
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
.detail-container {
  width: 100%;
  margin-top: 20px;
  /* 统一毛玻璃风格 */
  background: rgba(30, 30, 30, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 16px;
  overflow: hidden;
  color: #fff;
}

.q-section {
  padding: 30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.a-section {
  padding: 30px;
  background: rgba(255, 255, 255, 0.03);
}

.label-tag {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 0.8em;
  margin-bottom: 15px;
  font-weight: bold;
}

.q-tag { background: rgba(255, 255, 255, 0.2); color: #fff; }
.a-tag { background: #3eaf7c; color: #fff; }

.q-title {
  margin: 0 0 15px 0;
  font-size: 1.5em;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

.content, .answer {
  line-height: 1.8;
  white-space: pre-wrap;
  margin: 0;
  font-size: 1.1em;
  color: rgba(255, 255, 255, 0.9);
}

.q-img {
  max-width: 100%;
  border-radius: 8px;
  margin-top: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.footer-info {
  margin-top: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date {
  font-size: 0.85em;
  color: rgba(255, 255, 255, 0.5);
}

.back-btn {
  color: #3eaf7c;
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s;
}

.back-btn:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.status-msg {
  padding: 40px;
  text-align: center;
  color: #fff;
  background: rgba(30,30,30,0.6);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}
.status-msg.error { color: #ff6b6b; }
</style>