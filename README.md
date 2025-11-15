# Arc Navbar React Port

This repository now contains a reusable React component that reproduces the Arc browser marketing navbar with styling that matches the original static export. The component is written for React 19 and is ready to be dropped into a Next.js 16 project.

## Usage

1. Copy `src/components/navbar` into your Next.js `app` or `src` directory.
2. Import the component inside a client component:

```tsx
'use client';

import { Navbar } from '@/components/navbar';

export default function Page() {
  return (
    <>
      <Navbar />
      {/* rest of the page */}
    </>
  );
}
```

The navbar automatically detects whether the visitor is on macOS or Windows to show the matching download CTA and includes an accessible mobile menu implementation.

## Styling

The CSS module located at `src/components/navbar/Navbar.module.css` mirrors the gradient, spacing, and interaction states of the original Arc landing page while remaining fully responsive. Feel free to adjust CSS variables or class names to fit your design system.
