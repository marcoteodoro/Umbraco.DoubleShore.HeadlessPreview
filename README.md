# 🚀 Umbraco Headless Preview

**Instant frontend preview for your headless Umbraco setup**

[![NuGet](https://img.shields.io/nuget/v/Umbraco.DoubleShore.HeadlessPreview.svg)](https://www.nuget.org/packages/Umbraco.DoubleShore.HeadlessPreview/)
[![Umbraco Marketplace](https://img.shields.io/badge/Umbraco-Marketplace-blue)](https://marketplace.umbraco.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Built with ❤️ by [Double Shore](https://double-shore.com) - Your trusted Umbraco specialists.

---

## ✨ What is this?

**Umbraco.DoubleShore.HeadlessPreview** seamlessly connects Umbraco's backoffice to your frontend application, enabling content editors to preview unpublished changes in real-time with a single click.

![Preview Demo](docs/preview-demo.gif)

### 🎯 Perfect for Headless CMS Setups

When you decouple Umbraco from your frontend, you lose the native preview functionality. This package brings it back - better than ever.

---

## 🌟 Features

| Feature | Description |
|---------|-------------|
| **One-Click Preview** | Preview button appears directly in Umbraco's content editor |
| **Any Frontend** | Works with Next.js, Nuxt, Astro, SvelteKit, Remix, and more |
| **Multi-Language** | Full support for multilingual content preview |
| **Draft Mode** | Integrates with your frontend's draft/preview mode |
| **Zero Config** | Just add your frontend URL - we handle the rest |
| **Lightweight** | Minimal footprint, maximum performance |

---

## 📦 Installation

```bash
dotnet add package Umbraco.DoubleShore.HeadlessPreview
```

Or via NuGet Package Manager:
```
Install-Package Umbraco.DoubleShore.HeadlessPreview
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
    "PreviewLabel": "Preview on Frontend"
  }
}
```

### 2. Implement Frontend Endpoint

Create a preview API endpoint on your frontend. Here's an example for **Next.js**:

```typescript
// app/api/preview/route.ts
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');
  const path = searchParams.get('path');

  // Validate secret
  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 });
  }

  // Enable draft mode
  const draft = await draftMode();
  draft.enable();

  // Redirect to the content
  redirect(path || '/');
}
```

### 3. Preview!

That's it! Click **"Preview on Frontend"** in Umbraco's content editor to see your unpublished changes.

---

## 🔧 Configuration Options

| Setting | Description | Default |
|---------|-------------|---------|
| `BaseUrl` | Your frontend URL | *required* |
| `PreviewSecret` | Shared secret for authentication | *required* |
| `PreviewEndpoint` | Path to your preview API | `/api/preview` |
| `PreviewLabel` | Button label in Umbraco | `Preview on Frontend` |
| `Enabled` | Enable/disable the package | `true` |

---

## 🖼️ Frontend Examples

We provide example implementations for popular frameworks:

- [Next.js (App Router)](examples/nextjs/)
- [Nuxt 3](examples/nuxt/)
- [Astro](examples/astro/)
- [SvelteKit](examples/sveltekit/)

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
- 📧 Email: hello@double-shore.com
- 🐦 Twitter: [@DoubleShore](https://twitter.com/DoubleShore)
- 💼 LinkedIn: [Double Shore](https://linkedin.com/company/double-shore)

---

<p align="center">
  <a href="https://double-shore.com">
    <img src="icon.png" alt="Double Shore" width="100">
  </a>
  <br>
  <strong>Double Shore</strong>
  <br>
  <em>Digital Solutions Built with Clarity</em>
</p>
