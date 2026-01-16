<template>
  <div class="ask-container">
    <div class="input-group">
      <label>标题</label>
      <input type="text" v-model="title" placeholder="用一句话概括你的问题..." maxlength="60" />
    </div>
    <div class="input-group">
      <label>详细内容</label>
      <textarea v-model="content" rows="6" placeholder="想对我说什么？" maxlength="1000"></textarea>
    </div>
    <div class="input-group">
      <label>上传图片 (可选)</label>
      <input type="file" accept="image/png,image/jpeg,image/gif" v-on:change="handleFile" />
      <div v-if="previewUrl" class="preview">
        <img v-bind:src="previewUrl" />
      </div>
    </div>
    <button v-on:click="submit" v-bind:disabled="loading" class="submit-btn">
      {{ loading ? '提交中...' : '匿名提交' }}
    </button>
    <p v-if="message" v-bind:class="['msg', isError ? 'err' : 'ok']">{{ message }}</p>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      title: '',
      content: '',
      file: null,
      previewUrl: '',
      loading: false,
      message: '',
      isError: false
    }
  },
  methods: {
    handleFile: function(e) {
      var file = e.target.files[0];
      if (file) {
        this.file = file;
        this.previewUrl = URL.createObjectURL(file);
      }
    },
    submit: function() {
      if (!this.title || !this.content) {
        this.isError = true;
        this.message = '请填写完整信息';
        return;
      }
      this.loading = true;
      this.message = '';
      
      var fd = new FormData();
      fd.append('title', this.title);
      fd.append('content', this.content);
      if (this.file) fd.append('image', this.file);

      var self = this;
      fetch('http://localhost:8787/api/questions', {
        method: 'POST',
        body: fd
      })
      .then(function(res) {
        if (res.ok) {
          self.isError = false;
          self.message = '提交成功！等我回复后就会公开显示哦~';
          self.title = '';
          self.content = '';
          self.file = null;
          self.previewUrl = '';
        } else {
          throw new Error();
        }
      })
      .catch(function(e) {
        self.isError = true;
        self.message = '提交失败，请稍后再试';
      })
      .finally(function() {
        self.loading = false;
      });
    }
  }
}
</script>

<style scoped>
.ask-container { padding: 20px; border: 1px solid #eaecef; border-radius: 8px; background: #fff; color: #2c3e50; }
.input-group { margin-bottom: 15px; }
label { display: block; font-weight: bold; margin-bottom: 5px; }
input[type="text"], textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box; }
.submit-btn { background: #3eaf7c; color: #fff; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; }
.submit-btn:disabled { background: #ccc; cursor: not-allowed; }
.preview img { max-width: 200px; margin-top: 10px; border-radius: 4px; border: 1px solid #eee; }
.msg { margin-top: 10px; font-weight: bold; }
.err { color: #e53935; }
.ok { color: #43a047; }
</style>