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

      // 兼容后端：自动生成 title（不增加任何输入框，不影响现有交互）
      // 取第一行前 20 字，避免换行导致 title 很怪
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

<style scoped>
/* 让表单整体成为一个“独立盒子”，不被外层主题挤压 */
.ask-container{
  box-sizing: border-box;
  width: 100%;
  max-width: 520px;
  padding: 16px;
  margin-top: 16px;

  background: rgba(30, 30, 30, 0.55);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}

/* 强制每组输入独占一行，避免被全局样式搞成 inline/float */
.input-group{
  display: block;
  width: 100%;
  margin-bottom: 14px;
}

/* label 强制块级，避免跑到输入框旁边 */
.input-group label{
  display: block;
  margin-bottom: 8px;
  font-size: 0.9em;
  color: rgba(255,255,255,0.8);
}

/* textarea 强制占满容器宽度 */
textarea{
  display: block;
  width: 100%;
  box-sizing: border-box;

  background: rgba(0,0,0,0.25);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 8px;

  color: #fff;
  padding: 10px 12px;
  font-size: 16px;
  line-height: 1.6;
  resize: vertical;
  outline: none;
}

textarea:focus{
  border-color: #3eaf7c;
}

/* file input 也强制块级，避免和文字挤在一行 */
input[type="file"]{
  display: block;
  width: 100%;
  box-sizing: border-box;
  color: rgba(255,255,255,0.85);
}

/* 按钮全宽且稳定 */
.submit-btn{
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;

  background: #3eaf7c;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}

.submit-btn:disabled{
  opacity: 0.7;
  cursor: not-allowed;
}

.preview{
  margin-top: 10px;
}

.preview img{
  display: block;
  max-width: 140px;
  border-radius: 8px;
  border: 1px solid rgba(255,255,255,0.15);
}

.msg{
  margin-top: 12px;
  font-size: 0.95em;
  text-align: center;
}

.msg.err{ color: #ff6b6b; }
.msg.ok{ color: #3eaf7c; }
</style>
