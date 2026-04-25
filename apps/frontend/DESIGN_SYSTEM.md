# Smart Fashion Global UI Design System

## Overview
A professional, cohesive design system built with Tailwind CSS for the Smart Fashion styling application. This system ensures consistency and maintains a premium, clean aesthetic across all pages.

---

## Color Palette

### Primary Colors (Brand)
- **Primary-50**: `#faf8f5` - Lightest background
- **Primary-700**: `#8b7d67` - Main interactive elements
- **Primary-800**: `#6d5f52` - Deep brand color
- **Primary-950**: `#3d3731` - Darkest text

### Accent Colors
- **Sky**: `#0ea5e9` - Primary CTAs (Call-to-action)
- **Emerald**: `#10b981` - Success states
- **Rose**: `#f43f5e` - Destructive actions
- **Amber**: `#f59e0b` - Warnings
- **Violet**: `#8b5cf6` - Secondary highlights

---

## Typography

### Font Families
- **Sans**: Inter (Body text, UI labels)
- **Serif**: Playfair Display (Headings, emphasis)

### Font Sizes & Line Heights
- **H1**: 36px, Line height 40px
- **H2**: 30px, Line height 36px
- **H3**: 24px, Line height 32px
- **Base**: 16px, Line height 24px
- **Small**: 14px, Line height 20px

---

## Spacing System

Consistent spacing using a scale:
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **2xl**: 32px
- **3xl**: 48px
- **4xl**: 64px

**Usage**: Use these as padding, margin, and gaps
```jsx
<div className="p-lg mb-2xl gap-lg">...</div>
```

---

## Component Usage Examples

### Button Component

```jsx
import Button from '@/components/Button';

// Variants: primary, secondary, accent, danger, ghost, outline
<Button variant="accent" size="md">Click Me</Button>
<Button variant="primary" size="lg" disabled>Save</Button>
<Button variant="ghost" size="sm">Cancel</Button>
```

### Card Component

```jsx
import Card from '@/components/Card';

<Card>Basic card</Card>
<Card interactive>Clickable card</Card>
<Card className="p-2xl">Custom padding</Card>
```

### Badge Component

```jsx
import Badge from '@/components/Badge';

// Variants: primary, success, accent, warning, error
<Badge variant="success">Active</Badge>
<Badge variant="error">Failed</Badge>
```

### Alert Component

```jsx
import Alert from '@/components/Alert';

// Types: success, error, warning, info
<Alert type="success" title="Success!" onClose={() => {}}>
  Your profile has been updated successfully
</Alert>
```

### Input Field Component

```jsx
import InputField from '@/components/InputField';

<InputField
  label="Full Name"
  name="fullName"
  placeholder="Enter name"
  required
  error={errors.fullName}
  helper="Maximum 50 characters"
/>
```

### Progress Bar Component

```jsx
import ProgressBar from '@/components/ProgressBar';

<ProgressBar value={65} max={100} variant="primary" />
<ProgressBar value={80} max={100} variant="accent" size="lg" />
```

### Container Component

```jsx
import Container from '@/components/Container';

<Container size="md" className="py-3xl">
  Your content here
</Container>
```

---

## CSS Utility Classes

### Text Utilities
```jsx
<h1 className="text-gradient">Gradient text</h1>
<p className="truncate-lines-2">Truncated text (2 lines)</p>
```

### Layout Utilities
```jsx
<div className="glass">Glassmorphism effect</div>
<div className="soft-shadow">Soft shadow</div>
<div className="gradient-primary">Gradient background</div>
```

### Interactive States
```jsx
// Focus ring
<input className="focus-ring" />

// Disabled state
<button className="disabled:opacity-disabled">Disabled</button>
```

---

## Shadows (Elevation Levels)

- **xs**: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **sm**: `0 1px 3px 0 rgba(0, 0, 0, 0.08)`
- **base** (default): `0 4px 6px -1px rgba(0, 0, 0, 0.08)`
- **md**: `0 10px 15px -3px rgba(0, 0, 0, 0.1)`
- **lg**: `0 20px 25px -5px rgba(0, 0, 0, 0.1)`
- **card**: `0 2px 8px rgba(107, 74, 47, 0.08)`
- **card-hover**: `0 12px 24px rgba(107, 74, 47, 0.12)`

---

## Border Radius

- **xs**: 4px
- **sm**: 6px
- **base**: 8px (default)
- **md**: 12px
- **lg**: 16px
- **xl**: 20px
- **2xl**: 24px

---

## Global CSS Classes

### Text Hierarchy
```jsx
<h1 className="text-4xl font-serif font-bold">Main Title</h1>
<h2 className="text-3xl font-serif font-bold">Section Title</h2>
<h3 className="text-2xl font-serif font-semibold">Subsection</h3>
<p className="text-base">Body text</p>
```

### Form Elements
```jsx
<div className="input-group">
  <label className="input-label">Label *</label>
  <input type="text" />
  <p className="input-helper">Helper text</p>
  <p className="input-error">Error message</p>
</div>
```

### Status Badges
```jsx
<span className="badge badge-success">Success</span>
<span className="badge badge-error">Error</span>
<span className="badge badge-warning">Warning</span>
```

### Alerts
```jsx
<div className="alert alert-success">Success message</div>
<div className="alert alert-error">Error message</div>
```

---

## Responsive Design

Breaking points:
- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
  {/* 1 column on mobile, 2 on tablet, 3 on desktop */}
</div>
```

---

## Transitions & Animations

- **fast**: 150ms
- **base**: 200ms (default)
- **slow**: 300ms

```jsx
<div className="transition-all duration-slow hover:opacity-80">
  Smooth transition
</div>
```

---

## Best Practices

### 1. **Structure**
- Always wrap content in `<Container>` for proper page width
- Use `<Card>` for grouping related content
- Maintain consistent spacing using the spacing scale

### 2. **Color Usage**
- Use `primary-*` for main UI elements
- Use `accent-sky` for important CTAs
- Use semantic colors (success, error, warning)
- Avoid inline color codes; use Tailwind classes

### 3. **Typography**
- Use serif fonts for headings
- Use sans-serif for body text and UI
- Maintain proper heading hierarchy (H1 → H6)
- Avoid text sizes other than defined scale

### 4. **Interactive Elements**
- Always provide visual feedback (hover, focus, active states)
- Use proper button variants for actions
- Include focus rings for accessibility
- Use `disabled:opacity-disabled` for disabled states

### 5. **Accessibility**
- Include proper labels on form elements
- Use `aria-label` on icon-only buttons
- Maintain color contrast ratios (WCAG AA)
- Test keyboard navigation

---

## Migration Guide

To update existing components:

1. Replace inline colors with Tailwind classes
2. Use component utilities instead of custom styling
3. Apply spacing scale consistently
4. Update shadow usage to use predefined levels
5. Import and use reusable components

**Before:**
```jsx
<div className="bg-gray-100 p-4 rounded-lg shadow-lg">
  <button className="bg-blue-500 text-white px-4 py-2">Click</button>
</div>
```

**After:**
```jsx
<Card>
  <Button variant="accent">Click</Button>
</Card>
```

---

## File Structure

- `src/components/Button.jsx` - Button component
- `src/components/Card.jsx` - Card component
- `src/components/Badge.jsx` - Badge component
- `src/components/Alert.jsx` - Alert component
- `src/components/InputField.jsx` - Form input
- `src/components/ProgressBar.jsx` - Progress indicator
- `src/components/Container.jsx` - Layout container
- `src/index.css` - Global styles & component utilities
- `tailwind.config.js` - Tailwind configuration

---

## Support & Questions

For consistency questions or new patterns needed, refer to this guide or check existing components for examples.
