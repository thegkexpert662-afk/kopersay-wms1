import { onRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

initializeApp();

const GITHUB_TOKEN = defineSecret('GITHUB_TOKEN');
const GITHUB_OWNER = 'thegkexpert662-afk';
const GITHUB_REPO = 'sorce-code';
const GITHUB_BRANCH = 'main';
const MAX_ZIP_BYTES = 20 * 1024 * 1024;
const MAX_PREVIEW_CHARS = 700000;

function json(res, status, body) {
  res.status(status).set('Cache-Control', 'no-store').json(body);
}

async function requireAdmin(req, res) {
  const header = req.get('Authorization') || '';
  if (!header.startsWith('Bearer ')) {
    json(res, 401, { error: 'Firebase login required.' });
    return null;
  }
  try {
    const decoded = await getAuth().verifyIdToken(header.slice(7));
    return decoded;
  } catch {
    json(res, 401, { error: 'Invalid or expired Firebase login.' });
    return null;
  }
}

function safeName(value) {
  return String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'source-code';
}

async function githubPut(path, base64, message) {
  const response = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${GITHUB_TOKEN.value()}`,
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message, content: base64, branch: GITHUB_BRANCH })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || `GitHub upload failed (${response.status})`);
  }
  return data;
}

export const createMarketplaceProduct = onRequest(
  { region: 'us-central1', timeoutSeconds: 120, memory: '1GiB', cors: true, secrets: [GITHUB_TOKEN], invoker: 'public' },
  async (req, res) => {
    if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed.' });
    const admin = await requireAdmin(req, res);
    if (!admin) return;

    try {
      const { name, price, version, category, description, zipName, zipBase64, previewDataUrl } = req.body || {};
      if (!name || !zipName || !zipBase64) return json(res, 400, { error: 'Application name and ZIP file are required.' });
      if (!String(zipName).toLowerCase().endsWith('.zip')) return json(res, 400, { error: 'Only .zip files are allowed.' });

      const estimatedBytes = Math.floor(String(zipBase64).length * 0.75);
      if (estimatedBytes > MAX_ZIP_BYTES) {
        return json(res, 413, { error: 'ZIP is too large. The current secure upload limit is 20 MB.' });
      }
      if (previewDataUrl && String(previewDataUrl).length > MAX_PREVIEW_CHARS) {
        return json(res, 413, { error: 'Preview image is too large. Please use a smaller image.' });
      }

      const id = `${Date.now()}-${safeName(name).toLowerCase()}`;
      const zipPath = `products/${id}/${safeName(zipName)}`;
      const github = await githubPut(
        zipPath,
        String(zipBase64).replace(/^data:.*?;base64,/, ''),
        `Add source code: ${name}`
      );

      const product = {
        id,
        name: String(name).trim(),
        price: Number(price || 0),
        version: String(version || '').trim(),
        category: String(category || '').trim(),
        description: String(description || '').trim(),
        zipName: safeName(zipName),
        githubPath: zipPath,
        previewDataUrl: previewDataUrl || '',
        createdAt: FieldValue.serverTimestamp(),
        createdBy: admin.uid
      };

      await getFirestore().collection('marketplaceProducts').doc(id).set(product);
      return json(res, 201, { ok: true, product: { ...product, createdAt: undefined, createdBy: undefined }, commit: github.commit?.sha || null });
    } catch (error) {
      console.error(error);
      return json(res, 500, { error: error?.message || 'Marketplace listing could not be created.' });
    }
  }
);

export const getMarketplaceProducts = onRequest(
  { region: 'us-central1', cors: true, invoker: 'public' },
  async (req, res) => {
    if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed.' });
    try {
      const snapshot = await getFirestore().collection('marketplaceProducts').orderBy('createdAt', 'desc').get();
      const products = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name || '',
          price: Number(data.price || 0),
          version: data.version || '',
          category: data.category || '',
          description: data.description || '',
          zipName: data.zipName || '',
          previewDataUrl: data.previewDataUrl || ''
        };
      });
      return json(res, 200, { products });
    } catch (error) {
      console.error(error);
      return json(res, 500, { error: 'Marketplace products could not be loaded.' });
    }
  }
);
