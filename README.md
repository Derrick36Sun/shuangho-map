# 🗺 通勤圈查詢 Commute Isochrone Explorer

## 專案結構

```
commute-app/
├── public/
│   └── index.html          ← 前端（無任何 API Key）
├── netlify/
│   └── functions/
│       └── isochrone.js    ← 後端代理（API Key 在此）
├── netlify.toml            ← Netlify 設定
└── README.md
```

## 部署到 Netlify（免費）

### 步驟 1：上傳到 GitHub

```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/你的帳號/commute-app.git
git push -u origin main
```

### 步驟 2：連接 Netlify

1. 去 [netlify.com](https://netlify.com) 登入（免費）
2. **Add new site → Import an existing project**
3. 選 GitHub → 選你的 repo
4. Build 設定會自動讀取 `netlify.toml`，直接點 **Deploy**

### 步驟 3：設定環境變數（最重要！）

1. Netlify 後台 → 你的 site → **Site configuration → Environment variables**
2. 新增以下三個變數：

| Key | Value |
|-----|-------|
| `TRAVELTIME_APP_ID` | `52663e69` |
| `TRAVELTIME_API_KEY` | `528938688ee21b8d633050e3cc307776` |
| `ALLOWED_ORIGIN` | `https://你的帳號.github.io` 或 `https://你的site.netlify.app` |

3. 設完後點 **Trigger deploy** 重新部署

### 步驟 4：設定 Google Maps API Key 限制

在 [Google Cloud Console](https://console.cloud.google.com) → API & Services → Credentials：
1. 點你的 API Key → **Application restrictions → HTTP referrers**
2. 加入你的 Netlify 網址：`https://你的site.netlify.app/*`
3. **API restrictions** → 只勾選：
   - Maps JavaScript API
   - Places API
   - Geocoding API

---

## 安全架構

```
瀏覽器（Netlify CDN）
    ↓  fetch('/api/isochrone')     ← 不含任何 Key
Netlify Function（伺服器端）
    ↓  X-Api-Key: $TRAVELTIME_API_KEY  ← 從環境變數讀取
TravelTime API
```

**任何人按 F12 只會看到 `/api/isochrone`，看不到任何 Key。**

---

## Google Maps Key 說明

Google Maps JavaScript API 的 Key 本來就設計為前端使用，
透過 **HTTP Referrer 限制** 保護（只有你的網域才能用）。
這是 Google 的官方建議做法，不需要隱藏。
