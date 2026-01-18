<template>
  <div class="ask-container">
    <div class="input-group">
      <label>你的问题</label>
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
      if (!this.content) {
        this.isError = true;
        this.message = '请填写完整信息';
        return;
      }
      this.loading = true;
      this.message = '';

      var fd = new FormData();

      // 兼容后端：自动生成 title（取内容前 20 个字，可自行改长度）
      var autoTitle = (this.content || '').trim().split('\n')[0].slice(0, 20);
      fd.append('title', autoTitle || '匿名提问');


      fd.append('content', this.content);
      if (this.file) fd.append('image', this.file);

      var self = this;
      fetch('/api/questions', {
        method: 'POST',
        body: fd
      })
      .then(function(res) {
        if (res.ok) {
          self.isError = false;
          self.message = '提交成功！等我回复后就会公开显示哦~';
          self.content = '';
          self.file = null;
          self.previewUrl = '';
        } else {
          return res.text().then(function(t) {
            throw new Error('HTTP ' + res.status + ': ' + t);
          });
        }
      })
      .catch(function(e) {
        console.error(e);
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
