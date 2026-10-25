# LicenseGrid 🚀

An enterprise software license and seat orchestration platform built with **React**, **Vite**, and an **Executive Sidebar Navigation Layout** with an **Obsidian & Electric Sapphire Blue** corporate design system.

---

## 🧭 Executive Sidebar Architecture

The top horizontal navbar has been replaced with a fixed, collapsible **Left Sidebar Navigation** ([Sidebar.jsx](file:///c:/Users/Dinesh/OneDrive/Desktop/FEE_Project/src/components/Sidebar.jsx)):

- **Brand Header**: `LicenseGrid PRO` with collapse/expand toggle button for maximum screen estate.
- **Main Navigation**:
  - 🏠 **Home Overview**: Complete SaaS product presentation, hero, feature pillars, and live interactive spend preview.
  - 📊 **Dashboard & Inventory**: Live software license cards with seat load meters, real-time analytics, search, category filters, and modals.
- **Quick Actions**:
  - ➕ **Add Software**: Instantly opens license provisioning dialog from anywhere in the app.
  - 📥 **Export CSV**: Download complete corporate inventory spreadsheet.
  - 🔄 **Reset Sample Data**: Restore sample dataset anytime.
- **Bottom Profile & Authentication**:
  - User avatar with initials, full name, and email.
  - One-click logout button.
  - If signed out: Clean **Sign In**, **Register**, and **One-Click Demo Admin** buttons.
- **Mobile Responsive**: Off-canvas drawer with hamburger button for small screens.

---

## 🎨 Professional Obsidian & Sapphire Blue Palette
- **Primary Accent**: Electric Sapphire & Cobalt Blue (`#2563eb` & `#3b82f6`)
- **Background**: Deep Obsidian Slate (`#080c15` & `#0d1322`)
- **Surfaces**: Frosted dark glass cards (`rgba(16, 24, 40, 0.75)` / `#0f172a`)
- **Borders**: Crisp neutral slate borders (`rgba(255, 255, 255, 0.08)`)
- **Telemetry Indicators**: Emerald Green (`#10b981`), Amber (`#f59e0b`), Red (`#ef4444`)

---

## 🚀 Running the App

```bash
# Install dependencies
npm install

# Start local development server (port 3000)
npm run dev

# Build production bundle
npm run build
```

Your original files remain backed up in the [`legacy/`](file:///c:/Users/Dinesh/OneDrive/Desktop/FEE_Project/legacy) directory.
