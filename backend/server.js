import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT || 4000);
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET === 'replace_with_a_long_random_secret') throw new Error('Set JWT_SECRET in .env');
if (!process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD_HASH === 'replace_with_bcrypt_hash') throw new Error('Set ADMIN_PASSWORD_HASH in .env');

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || true, credentials: true }));
app.use(express.json({ limit: '1mb' }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, process.env.UPLOAD_DIR || './private-source-codes');
fs.mkdirSync(uploadDir, { recursive: true });
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')}`)
});
const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 }, fileFilter: (_req, file, cb) => cb(null, path.extname(file.originalname).toLowerCase() === '.zip') });

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  try { req.admin = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Unauthorized' }); }
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password || email.toLowerCase() !== String(process.env.ADMIN_EMAIL || '').toLowerCase()) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, process.env.ADMIN_PASSWORD_HASH);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ role: 'admin', email: email.toLowerCase() }, JWT_SECRET, { expiresIn: '2h' });
  res.json({ token, expiresIn: 7200 });
});

app.get('/api/admin/me', auth, (req, res) => res.json({ authenticated: true, email: req.admin.email, role: req.admin.role }));
app.post('/api/admin/source-codes', auth, upload.single('zip'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'ZIP file is required' });
  const product = { id: Date.now().toString(), name: req.body.name || '', price: Number(req.body.price || 0), version: req.body.version || '', category: req.body.category || '', description: req.body.description || '', zipFile: req.file.filename, createdAt: new Date().toISOString() };
  const indexFile = path.join(uploadDir, 'products.json');
  const products = fs.existsSync(indexFile) ? JSON.parse(fs.readFileSync(indexFile, 'utf8')) : [];
  products.push(product);
  fs.writeFileSync(indexFile, JSON.stringify(products, null, 2));
  res.status(201).json({ ok: true, product: { ...product, zipFile: undefined } });
});

app.listen(PORT, () => console.log(`Kopersay marketplace API running on port ${PORT}`));
