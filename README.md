# FinFlow Landing Page

Website landing page for **FinFlow** — the voice-first personal finance app.

## 🚀 Live Site

> Hosted on GitHub Pages: `https://<your-username>.github.io/<repo-name>/`

## 📁 Structure

```
web_finflow/
├── index.html      # Main landing page
├── styles.css      # Vanilla CSS (design system)
├── main.js         # Vanilla JS (interactions & animations)
└── README.md
```

## 🔧 Setup for GitHub Pages

1. Push this repository to GitHub
2. Go to **Settings → Pages**
3. Set Source to **"Deploy from a branch"**
4. Select branch `main` → folder `/ (root)`
5. Save — your site will be live in ~1 minute

## 📲 Adding Download Links

Open `main.js` and update these constants at the top of the file:

```js
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.yourapp';
const APK_URL        = 'https://github.com/yourrepo/releases/latest/download/finflow.apk';
```

## 🎨 Design System

- **Colors**: Soft Modern Clean (teal-green primary `#006947`)
- **Fonts**: Poppins (UI) + DM Mono (financial figures)
- **Icons**: Google Material Symbols Outlined

## 📄 License

© 2025 FinFlow. All rights reserved.
