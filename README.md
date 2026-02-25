# 🚀 Umbraco Headless Preview

**Instant frontend preview for your headless Umbraco setup**

[![NuGet](https://img.shields.io/nuget/v/DoubleShore.Umbraco.HeadlessPreview.svg)](https://www.nuget.org/packages/DoubleShore.Umbraco.HeadlessPreview/)
[![Umbraco Marketplace](https://img.shields.io/badge/Umbraco-Marketplace-blue)](https://marketplace.umbraco.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Built with ❤️ by [Double Shore](https://double-shore.com) - Your trusted Umbraco specialists.

---

## ✨ What is this?

**DoubleShore.Umbraco.HeadlessPreview** seamlessly connects Umbraco's backoffice to your frontend application, enabling content editors to preview unpublished changes in real-time with a single click.

### 🎯 Perfect for Headless CMS Setups

When you decouple Umbraco from your frontend, you lose the native preview functionality. This package brings it back - better than ever.

---

## 🌟 Features

| Feature | Description |
|---------|-------------|
| **One-Click Preview** | Preview button appears directly in Umbraco's content editor |
| **Any Frontend** | Works with Next.js, Nuxt, Astro, SvelteKit, Remix, and more |
| **Multi-Language** | Full support for multilingual content preview with localized labels |
| **Draft Mode** | Integrates with your frontend's draft/preview mode |
| **Localization** | Preview label can be localized via Umbraco dictionary |
| **Zero Config** | Just add your frontend URL - we handle the rest |
| **Lightweight** | Minimal footprint, maximum performance |

---

## 📦 Installation

```bash
dotnet add package DoubleShore.Umbraco.HeadlessPreview
```

Or via NuGet Package Manager:
```
Install-Package DoubleShore.Umbraco.HeadlessPreview
```

---

## ⚡ Quick Start

### 1. Configure Umbraco

Add to your `appsettings.json`:

```json
{
  "HeadlessPreview": {
    "BaseUrl": "https://your-frontend.com",
    "PreviewSecret": "your-super-secret-key",
    "PreviewEndpoint": "/api/preview",
    "PreviewLabel": "Preview on Frontend",
    "UseLocalization": true
  }
}
```

### 2. Implement Frontend Endpoint

Create a preview API endpoint on your frontend. See examples below for each framework.

### 3. Preview!

Click **"Preview on Frontend"** in Umbraco's content editor to see your unpublished changes.

---

## 🌍 Localization

To localize the preview label:

1. Create a dictionary item in Umbraco with key `HeadlessPreview_Label`
2. Add translations for each language
3. Set `PreviewLabel` to `#HeadlessPreview_Label` in appsettings.json

```json
{
  "HeadlessPreview": {
    "PreviewLabel": "#HeadlessPreview_Label",
    "UseLocalization": true
  }
}
```

---

## 🔧 Configuration Options

| Setting | Description | Default |
|---------|-------------|---------|
| `BaseUrl` | Your frontend URL | *required* |
| `PreviewSecret` | Shared secret for authentication | *required* |
| `PreviewEndpoint` | Path to your preview API | `/api/preview` |
| `PreviewLabel` | Button label (or dictionary key with #) | `Preview on Frontend` |
| `UseLocalization` | Enable dictionary lookup for label | `true` |
| `Enabled` | Enable/disable the package | `true` |

---

## 🖼️ Frontend Examples

### Next.js (App Router)

```typescript
// app/api/preview/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');

  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  const draft = await draftMode();
  draft.enable();
  redirect(path || '/');
}
```

### Nuxt 3

```typescript
// server/api/preview.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  
  if (query.secret !== process.env.PREVIEW_SECRET) {
    throw createError({ statusCode: 401, message: 'Invalid token' });
  }

  // Enable preview mode via cookie
  setCookie(event, 'preview-mode', 'true', { path: '/' });
  
  return sendRedirect(event, query.path as string || '/');
});
```

### Astro

```typescript
// src/pages/api/preview.ts
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const url = new URL(request.url);
  const secret = url.searchParams.get('secret');
  const path = url.searchParams.get('path');

  if (secret !== import.meta.env.PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  cookies.set('preview-mode', 'true', { path: '/' });
  return redirect(path || '/');
};
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🏢 About Double Shore

**[Double Shore](https://double-shore.com)** is a digital consultancy specializing in Umbraco development, headless CMS architectures, and modern web solutions.

### Our Services

- 🔧 **Umbraco Development** - Custom implementations and migrations
- 🚀 **Headless CMS** - Decoupled architectures with modern frontends
- 📈 **Performance Optimization** - Making your sites blazing fast
- 🎓 **Training & Consulting** - Upskill your team

### Get in Touch

- 🌐 Website: [double-shore.com](https://double-shore.com)
- 📧 Email: info@double.pt
- 💼 LinkedIn: [Double Design and Development](https://www.linkedin.com/company/double-design-and-development)

---

<p align="center">
  <strong>Double Shore</strong>
  <br>
  <em>Digital Solutions Built with Clarity</em>
</p>
