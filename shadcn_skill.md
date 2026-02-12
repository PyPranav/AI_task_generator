# shadcn/ui — Mandatory UI Component Rules

## Core Directive

**You MUST use [shadcn/ui](https://ui.shadcn.com/) components for ALL UI work.** Do not use raw HTML elements, other component libraries (MUI, Chakra, Ant Design, Radix primitives directly, etc.), or hand-rolled components when a shadcn equivalent exists. Only deviate from shadcn if the user **explicitly** requests a different library, or the requirement genuinely cannot be fulfilled with any shadcn component.

---

## Installation

shadcn components are added individually. Before using any component, **always check if it is already installed** in the project. If it is not, install it immediately:

```bash
npx shadcn@latest add <component-name>
```

Examples:

```bash
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add table
npx shadcn@latest add card
```

You can install multiple at once:

```bash
npx shadcn@latest add button card dialog input label
```

> **Never skip the install step.** If a component import fails, the most likely cause is that it hasn't been added yet.

---

## Available Components

Use the following components **whenever applicable**. This is the complete list — always prefer these over custom implementations:

| Component | Use For |
|---|---|
| **Accordion** | Collapsible content sections |
| **Alert** | Inline status / info messages |
| **Alert Dialog** | Destructive or critical confirmations |
| **Aspect Ratio** | Maintaining media aspect ratios |
| **Avatar** | User profile images / initials |
| **Badge** | Status indicators, tags, labels |
| **Breadcrumb** | Navigation hierarchy |
| **Button** | All clickable actions |
| **Button Group** | Grouped related actions |
| **Calendar** | Date selection UI |
| **Card** | Content containers / sections |
| **Carousel** | Slideshows, image galleries |
| **Chart** | Data visualizations |
| **Checkbox** | Boolean / multi-select inputs |
| **Collapsible** | Show/hide content toggle |
| **Combobox** | Searchable select / autocomplete |
| **Command** | Command palette / search interface |
| **Context Menu** | Right-click menus |
| **Data Table** | Tabular data with sorting/filtering/pagination |
| **Date Picker** | Date input fields |
| **Dialog** | Modal dialogs / popups |
| **Direction** | RTL/LTR support |
| **Drawer** | Slide-out panels (mobile-friendly) |
| **Dropdown Menu** | Action menus, option menus |
| **Empty** | Empty state placeholders |
| **Field** | Form field wrapper with label/error |
| **Hover Card** | Preview content on hover |
| **Input** | Text input fields |
| **Input Group** | Grouped inputs with addons |
| **Input OTP** | One-time password / code inputs |
| **Item** | Generic list item |
| **Kbd** | Keyboard shortcut display |
| **Label** | Form labels |
| **Menubar** | Application menu bars |
| **Native Select** | Native browser select dropdown |
| **Navigation Menu** | Site navigation |
| **Pagination** | Page navigation controls |
| **Popover** | Floating content panels |
| **Progress** | Progress bars |
| **Radio Group** | Single-select option groups |
| **Resizable** | Resizable panel layouts |
| **Scroll Area** | Custom scrollable regions |
| **Select** | Styled dropdown select |
| **Separator** | Visual dividers |
| **Sheet** | Side panels / slide-overs |
| **Sidebar** | App sidebar navigation |
| **Skeleton** | Loading placeholders |
| **Slider** | Range / value sliders |
| **Sonner** | Toast notifications (via Sonner) |
| **Spinner** | Loading spinners |
| **Switch** | Toggle switches |
| **Table** | Static tables |
| **Tabs** | Tabbed content navigation |
| **Textarea** | Multi-line text input |
| **Toast** | Notification toasts |
| **Toggle** | Toggle buttons |
| **Toggle Group** | Grouped toggle buttons |
| **Tooltip** | Hover tooltips |
| **Typography** | Consistent text styling |

---

## Rules

1. **Default to shadcn.** Every `<button>`, `<input>`, `<table>`, modal, dropdown, toast, etc. must use the shadcn version.
2. **Install before use.** Run `npx shadcn@latest add <component>` for any component not yet in the project.
3. **No alternatives unless forced.** Do not introduce another UI library unless the user explicitly asks for one, or the requirement is impossible with shadcn.
4. **Compose when needed.** If a UI pattern doesn't map to a single component, compose multiple shadcn components together (e.g., `Dialog` + `Command` for a search modal).
5. **Follow shadcn conventions.** Use the component APIs and patterns as documented on [ui.shadcn.com](https://ui.shadcn.com/). Don't override or wrap them unnecessarily.
6. **Styling with Tailwind.** shadcn components are built on Tailwind CSS. Use Tailwind utilities for any additional styling — do not introduce separate CSS files or CSS-in-JS for component styling.