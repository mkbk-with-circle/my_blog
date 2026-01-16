<template>
  <div class="list-container">
    <div v-if="loading">加载中...</div>
    <div v-else-if="list.length === 0">还没有已回复的提问哦~</div>
    <div v-else class="grid">
      <div v-for="item in list" v-bind:key="item.id" class="card" v-on:click="goDetail(item.id)">
        <div class="card-title">{{ item.title }}</div>
        <div class="card-date">{{ formatDate(item.answered_at) }}</div>
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
    fetch('http://localhost:8787/api/questions/public')
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
.list-container { color: #2c3e50; }
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; margin-top: 20px; }
.card { padding: 15px; border: 1px solid #eaecef; border-radius: 8px; cursor: pointer; transition: all 0.3s; background: #fff; }
.card:hover { border-color: #3eaf7c; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
.card-title { font-weight: bold; margin-bottom: 8px; color: #3eaf7c; }
.card-date { font-size: 0.8em; color: #999; }
</style>