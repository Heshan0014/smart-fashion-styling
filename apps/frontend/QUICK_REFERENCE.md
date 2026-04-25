# Quick Reference - Global UI System

## 🎯 Common Patterns

### Page Template
```jsx
import Container from '@/components/Container';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function Page() {
  return (
    <div className="min-h-screen bg-primary-50">
      <Container size="md" className="py-3xl">
        <Card>
          <h1>Page Title</h1>
          <p className="text-primary-600 mt-md">Description</p>
          <Button variant="accent" className="mt-lg">Action</Button>
        </Card>
      </Container>
    </div>
  );
}
```

### Form Section
```jsx
<div>
  <h3 className="text-xl font-semibold text-primary-900 mb-lg">
    📋 Section Title
  </h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
    <InputField label="Name" name="name" required />
    <InputField label="Email" name="email" type="email" />
  </div>
</div>
```

### Status Cards
```jsx
<Card interactive>
  <div className="flex items-center justify-between">
    <div>
      <h3 className="font-semibold text-primary-950">Status Item</h3>
      <p className="text-sm text-primary-600 mt-sm">Details</p>
    </div>
    <Badge variant="success">Active</Badge>
  </div>
</Card>
```

### Alert & Feedback
```jsx
{alertMessage && (
  <Alert 
    type="success" 
    onClose={() => setAlertMessage(null)}
    title="Success!"
  >
    Your changes were saved successfully
  </Alert>
)}
```

---

## 🎨 Color Quick Pick

### For Different Purposes:
```jsx
{/* Primary Actions */}
<Button variant="accent">Main CTA</Button>

{/* Secondary Actions */}
<Button variant="secondary">Secondary</Button>

{/* Destructive */}
<Button variant="danger">Delete</Button>

{/* Text-Only */}
<Button variant="ghost">Cancel</Button>

{/* Status - Success */}
<Badge variant="success">✓ Complete</Badge>

{/* Status - Warning */}
<Badge variant="warning">⚠ Review</Badge>

{/* Status - Error */}
<Badge variant="error">✕ Failed</Badge>
```

---

## 📏 Spacing & Layout

### Padding/Margin Shortcuts
```jsx
p-xs   // 4px
p-sm   // 8px
p-md   // 12px
p-lg   // 16px (common)
p-xl   // 24px
p-2xl  // 32px (large sections)

// Apply to specific sides
mt-lg   // margin-top
mb-lg   // margin-bottom
px-lg   // padding left/right
py-md   // padding top/bottom
```

### Gaps Between Items
```jsx
<div className="space-y-lg">
  {/* items with 16px gap */}
</div>

<div className="flex gap-md">
  {/* horizontal items with 12px gap */}
</div>
```

---

## 🔤 Typography Quick Guide

```jsx
// Headings
<h1>Page Title</h1>          // 36px, bold, serif
<h2>Section Title</h2>        // 30px, bold, serif
<h3>Subsection</h3>          // 24px, semibold, serif
<h4>Label</h4>               // 20px, semibold

// Body Text
<p>Normal text</p>            // 16px, regular
<small className="text-sm">Small text</small>  // 14px
<small className="text-xs">Tiny text</small>   // 12px

// Emphasis
<strong>Bold text</strong>
<em>Italic text</em>
```

---

## 🎭 Interactive States

### Hover Effects
```jsx
<div className="hover:shadow-card-hover transition-all duration-base">
  Hover to see effect
</div>
```

### Focus States
```jsx
<input className="focus-ring" />     {/* Blue ring on focus */}
<button className="focus:ring-2 focus:ring-accent-sky" />
```

### Disabled States
```jsx
<button disabled className="disabled:opacity-disabled">
  Disabled
</button>
```

### Active/Selected
```jsx
<button className="bg-primary-700 text-white">Active</button>
<button className="bg-primary-200 text-primary-900">Inactive</button>
```

---

## 📱 Responsive Patterns

```jsx
{/* Mobile-first approach */}
<div className="block md:flex lg:grid">
  Shows as block on mobile, flex on tablet, grid on desktop
</div>

{/* Column layouts */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
  Adapts from 1 → 2 → 3 columns
</div>

{/* Padding adjustments */}
<div className="px-lg md:px-2xl lg:px-3xl">
  More padding on larger screens
</div>

{/* Font size scaling */}
<h1 className="text-2xl md:text-3xl lg:text-4xl">
  Responsive heading
</h1>
```

---

## ⚡ Component Cheat Sheet

### Button
```jsx
<Button variant="primary|secondary|accent|danger|ghost|outline" 
        size="sm|md|lg" 
        disabled>
  Label
</Button>
```

### Card
```jsx
<Card interactive>Content</Card>
```

### Badge  
```jsx
<Badge variant="primary|success|accent|warning|error">Text</Badge>
```

### Alert
```jsx
<Alert type="success|error|warning|info" title="Title" onClose={fn}>
  Message
</Alert>
```

### InputField
```jsx
<InputField 
  label="Label"
  name="name"
  type="text"
  required
  error="Error message"
  helper="Helper text"
/>
```

### ProgressBar
```jsx
<ProgressBar 
  value={65} 
  max={100} 
  variant="primary|success|accent|warning"
  size="sm|md|lg"
  animated
/>
```

### Container
```jsx
<Container size="sm|md|lg|xl|full" className="py-3xl">
  Content
</Container>
```

---

## 🔗 Links & Resources

- **Design System Guide**: `DESIGN_SYSTEM.md`
- **Implementation Notes**: `IMPLEMENTATION_SUMMARY.md`
- **Tailwind Colors**: Check `tailwind.config.js` for full palette
- **Component Files**: `src/components/`

---

## ✅ Common Mistakes to Avoid

❌ Don't:
```jsx
// Using arbitrary colors
<div className="bg-[#7a5a34]">Wrong</div>

// Hardcoded spacing
<div className="p-5 m-3 gap-2">Wrong</div>

// Missing semantic colors
<button className="bg-red-500">Delete</button>

// Inconsistent button styles
<button className="px-4 py-2 bg-blue-500">Inconsistent</button>
```

✅ Do:
```jsx
// Use Tailwind classes
<div className="bg-primary-700">Correct</div>

// Use spacing scale
<div className="p-lg m-md gap-md">Correct</div>

// Use component variants
<Button variant="danger">Delete</Button>

// Use compound components
<Button variant="accent">Consistent</Button>
```

---

## 🚀 Ready to Build!

You now have a production-ready design system. Start using these components and patterns across your application for a cohesive, professional interface.

**Remember**: Consistency = Quality. Always check this guide before styling new components.
