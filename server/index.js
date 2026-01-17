const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const crypto = require('crypto');

const app = express();
const PORT = 8787;

// ==========================================
// 【安全配置】请修改下方的管理口令
// ==========================================
const ADMIN_TOKEN = 'ymynb?'; 

// --- 1. 数据库初始化 ---
const dbPath = process.env.DB_PATH || path.join(__dirname, 'data.sqlite3');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS questions (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image_url TEXT,
    answer TEXT,
    status TEXT DEFAULT 'PENDING',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    answered_at DATETIME
  )
`);

// --- 2. 中间件配置 ---
app.use(cors());
app.use(express.json());

const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// uploads 静态文件：同时支持 /uploads 与 /api/uploads 两种访问方式
app.use('/uploads', express.static(uploadDir));
app.use('/api/uploads', express.static(uploadDir));

// --- 3. 图片上传配置 ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, crypto.randomUUID() + ext);
  }
});
const upload = multer({ storage });

// --- 4. 路由接口 ---

// 用户提交提问
app.post('/api/questions', upload.single('image'), (req, res) => {
  const { title, content } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const id = crypto.randomUUID();

  const stmt = db.prepare('INSERT INTO questions (id, title, content, image_url) VALUES (?, ?, ?, ?)');
  stmt.run(id, title, content, imageUrl);

  res.json({ success: true, id });
});

// 用户查看已回复列表
app.get('/api/questions/public', (req, res) => {
  const rows = db.prepare("SELECT * FROM questions WHERE status = 'ANSWERED' ORDER BY answered_at DESC").all();
  res.json(rows);
});

// 用户查看提问详情
app.get('/api/questions/detail/:id', (req, res) => {
  const row = db.prepare("SELECT * FROM questions WHERE id = ?").get(req.params.id);
  if (row && row.status === 'ANSWERED') {
    res.json(row);
  } else {
    res.status(404).json({ error: '未找到该提问或尚未回复' });
  }
});

// 【管理端】获取所有提问 (带 Token 校验)
app.get('/api/admin/questions', (req, res) => {
  const { token } = req.query;
  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Forbidden: 密码错误' });
  }
  const rows = db.prepare("SELECT * FROM questions ORDER BY created_at DESC").all();
  res.json(rows);
});

// 【管理端】回复提问 (带 Token 校验)
app.post('/api/admin/answer', (req, res) => {
  const { id, answer, token } = req.body;
  if (token !== ADMIN_TOKEN) {
    return res.status(403).json({ error: 'Forbidden: 密码错误' });
  }
  
  const stmt = db.prepare("UPDATE questions SET answer = ?, status = 'ANSWERED', answered_at = CURRENT_TIMESTAMP WHERE id = ?");
  const result = stmt.run(answer, id);
  
  if (result.changes > 0) {
    res.json({ success: true });
  } else {
    res.status(404).json({ error: '提问不存在' });
  }
});

// 删除提问接口
// 【管理端】删除提问接口 (适配 SQLite 版本)
app.post('/api/admin/delete', (req, res) => {
  try {
    const { id, token } = req.body;
    
    // 1. 权限校验
    if (token !== ADMIN_TOKEN) {
      return res.status(403).json({ error: '权限不足' });
    }

    // 2. 先查询该提问，为了获取图片路径
    const question = db.prepare("SELECT image_url FROM questions WHERE id = ?").get(id);

    if (!question) {
      return res.status(404).json({ error: '提问不存在' });
    }

    // 3. 如果有图片，删除磁盘上的文件
    if (question.image_url) {
      // 这里的逻辑：question.image_url 通常是 "/uploads/xxx.jpg"
      // 我们需要拼接成服务器上的绝对路径
      const filename = path.basename(question.image_url);
      const filePath = path.join(uploadDir, filename);
      
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error('磁盘文件删除失败:', err);
        }
      }
    }

    // 4. 从数据库中删除记录
    const stmt = db.prepare("DELETE FROM questions WHERE id = ?");
    const result = stmt.run(id);

    if (result.changes > 0) {
      res.json({ success: true });
    } else {
      res.status(500).json({ error: '数据库删除失败' });
    }
  } catch (error) {
    console.error('删除接口崩溃:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
