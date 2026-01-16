const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');
const crypto = require('crypto'); // 使用内置模块

const app = express();
const PORT = 8787;

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
app.use('/uploads', express.static(uploadDir));

// --- 3. 图片上传配置 ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, crypto.randomUUID() + ext); // 使用 randomUUID
  }
});
const upload = multer({ storage });

// --- 4. 路由接口 ---

app.post('/api/questions', upload.single('image'), (req, res) => {
  const { title, content } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
  const id = crypto.randomUUID(); // 使用 randomUUID

  const stmt = db.prepare('INSERT INTO questions (id, title, content, image_url) VALUES (?, ?, ?, ?)');
  stmt.run(id, title, content, imageUrl);

  res.json({ success: true, id });
});

app.get('/api/questions/public', (req, res) => {
  const rows = db.prepare("SELECT * FROM questions WHERE status = 'ANSWERED' ORDER BY answered_at DESC").all();
  res.json(rows);
});

app.get('/api/questions/detail/:id', (req, res) => {
  const row = db.prepare("SELECT * FROM questions WHERE id = ?").get(req.params.id);
  if (row && row.status === 'ANSWERED') {
    res.json(row);
  } else {
    res.status(404).json({ error: '未找到该提问或尚未回复' });
  }
});

app.get('/api/admin/questions', (req, res) => {
  const rows = db.prepare("SELECT * FROM questions ORDER BY created_at DESC").all();
  res.json(rows);
});

app.post('/api/admin/answer', (req, res) => {
  const { id, answer } = req.body;
  const stmt = db.prepare("UPDATE questions SET answer = ?, status = 'ANSWERED', answered_at = CURRENT_TIMESTAMP WHERE id = ?");
  stmt.run(answer, id);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});