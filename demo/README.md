# Demo Sites

This folder contains demo implementations for testing the Umbraco.DoubleShore.HeadlessPreview package.

## Quick Start

### 1. Start Umbraco

```bash
cd DemoUmbraco
dotnet run
```

Visit http://localhost:5000/umbraco and login with:
- Email: admin@example.com
- Password: Admin123!

### 2. Start Next.js

```bash
cd demo-nextjs
npm run dev
```

Visit http://localhost:3000

## Setup Content

1. In Umbraco backoffice, create a document type with:
   - Property: `bodyText` (Rich Text Editor)
   - Property: `title` (Textstring)
   
2. Create content based on this document type and publish

3. Click "Preview on Frontend" in the content editor to test the preview functionality

## Configuration

### Umbraco (appsettings.json)

```json
{
  "HeadlessPreview": {
    "BaseUrl": "http://localhost:3000",
    "PreviewSecret": "demo-preview-secret-12345",
    "PreviewEndpoint": "/api/preview"
  }
}
```

### Next.js (.env.local)

```env
UMBRACO_URL=http://localhost:5000
PREVIEW_SECRET=demo-preview-secret-12345
```
