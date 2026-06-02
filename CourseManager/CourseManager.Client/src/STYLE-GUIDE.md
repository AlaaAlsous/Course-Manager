# CourseManager Style Guide

A reference for all global styles, utility classes, mixins, and design tokens used in the project.

---

*This document is generated from `styles.scss`, `utilities.scss`, and `utilities-mixin.scss`. If you add/change/delete styles, please keep this guide updated.*

---

## Table of Contents

1. [Design Tokens (CSS Variables)](#1-design-tokens-css-variables)
   - [Colors](#colors)
   - [Shadows](#shadows)
   - [Radii](#radii)
   - [Spacing](#spacing)
   - [Font Sizes](#font-sizes)
   - [Z-index](#z-index)
2. [Global Element Styles](#2-global-element-styles)
3. [Utility Classes (`utilities.scss`)](#3-utility-classes)
   - [Display](#display)
   - [Flex Direction](#flex-direction)
   - [Flex Wrap](#flex-wrap)
   - [Alignment (justify-content / align-items)](#alignment)
   - [Spacing (margin & padding)](#spacing-utilities)
   - [Gap](#gap)
   - [Font Weight](#font-weight)
   - [Font Size](#font-size)
   - [Text Alignment](#text-alignment)
   - [Border Radii](#border-radii)
   - [Width / Height](#width--height)
   - [Max-width](#max-width)
   - [Background Colors](#background-colors)
   - [Text Colors](#text-colors)
   - [Cursor](#cursor)
   - [Object-fit](#object-fit)
   - [White-space](#white-space)
4. [Mixins (`utilities-mixin.scss`)](#4-mixins)
   - [Using Mixins](#using-mixins)
   - [card](#card)
   - [button](#button)
   - [list](#list)
   - [custom-scrollbar](#custom-scrollbar)
   - [search-input](#search-input)
   - [search-bar](#search-bar)
5. [Dark Mode](#5-dark-mode)

---

## 1. Design Tokens (CSS Variables)

All design tokens are defined in `styles.scss` under `:root`. Dark mode overrides are in a `@media (prefers-color-scheme: dark)` block. Use these variables instead of hardcoded values.

### Colors

```css
/* Backgrounds */
--color-bg              /* Page background      (#f8fafc light / #0e1621 dark) */
--color-bg-primary      /* Primary background   (#ffffff / #162032) */
--color-bg-secondary    /* Secondary background (#1a3a5c / #1c3454) */
--color-bg-tertiary     /* Tertiary background  (#1e4a72 / #26456e) */
--color-primary-bg      /* Alias for --color-bg-primary (compatability) */

/* Surfaces (cards, sheets, inputs) */
--color-surface         /* Surface background   (#f1f1f1 / #232d3a) */
--color-surface-hover   /* Surface hover        (#d7d9db / #394554) */

/* Text */
--color-text            /* Main body text       (#0f172a / #e8edf2) */
--color-text-secondary  /* Secondary text       (#334155 / #9aaebf) */
--color-text-muted      /* Muted / placeholder  (#64748b / #5c6f82) */
--color-text-light      /* Alias for --color-text-secondary */
--color-text-inverted   /* Text on primary      (#e8edf2 / #0f172a) */

/* Primary / Accent */
--color-primary         /* Primary action color (#197ec6 / #1f72ae) */
--color-primary-hover   /* Primary hover (#014f86 / #0562aa) */
--color-primary-soft    /* Soft primary bg (rgba...) */
--color-primary-border  /* Primary border (rgba...) */

--color-accent          /* Accent (#3b82f6 / #2c7ab1) */
--color-success         /* Success green (#10b981 / #1f8a4c) */
--color-warning         /* Warning yellow (#f59e0b / #d97706) */
--color-danger          /* Danger red (#ef4444 / #dc2626) */

/* Borders */
--color-border          /* Default border (#c1c2c3 / #232a33) */
--color-border-light    /* Light border (#d9dce0 / #1a212a) */

/* Navigation (aliases — use the original variables instead) */
--color-nav-bg          /* Alias for --color-bg-secondary */
--color-nav-text        /* Color for nav text   (rgba(255,255,255,0.9)) */

/* Shadow helpers */
--shadow-color              /* Shadow tint (rgba(0,0,0,0.07)) */
--shadow-color-intense      /* Intense shadow tint (rgba(0,0,0,0.14)) */

/* Scrollbar */
--scrollbar-size            /* Scrollbar width (11px) */
--gh-scrollbar-track        /* Scrollbar track */
--gh-scrollbar-thumb        /* Scrollbar thumb */
--gh-scrollbar-thumb-hover  /* Scrollbar thumb hover */
```

### Shadows

```css
--shadow-xs             /* 0 1px 2px */
--shadow-sm             /* 0 1px 3px, 0 1px 2px */
--shadow-md             /* 0 4px 6px, 0 2px 4px */
--shadow-lg             /* 0 10px 15px, 0 4px 6px */
--shadow-xl             /* 0 20px 25px, 0 10px 10px */
--shadow-2xl            /* 0 25px 50px (more intense) */
--shadow-elevated       /* Alias for --shadow-xl (use this for cards) */

/* Inner shadows */
--shadow-inner-sm       /* inset 0 1px 2px */
--shadow-inner-md       /* inset 0 2px 4px */
```

### Radii

```css
--radius-none: 0;           /* 0px       */
--radius-sm:  0.25rem;      /* 4px       */
--radius-md:  0.375rem;     /* 6px       */
--radius-lg:  0.5rem;       /* 8px       */
--radius-xl:  0.75rem;      /* 12px      */
--radius-2xl: 1rem;         /* 16px      */
--radius-full: 9999px;      /* Pill shape */
```

### Spacing

```css
--space-xs:  0.25rem;    /* 4px   */
--space-sm:  0.5rem;     /* 8px   */
--space-md:  1rem;       /* 16px  */
--space-lg:  1.5rem;     /* 24px  */
--space-xl:  2rem;       /* 32px  */
--space-2xl: 2.5rem;     /* 40px  */
```

### Font Sizes

```css
--font-size-sm: clamp(0.8rem, 1vw, 0.9rem);
--font-size-md: clamp(1rem, 1.5vw, 1.1rem);
--font-size-lg: clamp(1.2rem, 2vw, 1.6rem);
--font-size-xl: clamp(1.6rem, 3vw, 2.2rem);
```

These use `clamp()` so they scale responsively with the viewport.

### Z-index

```css
--z-dropdown: 100;
--z-sticky:   200;
--z-fixed:    300;
--z-modal:    400;
--z-popover:  500;
--z-tooltip:  600;
```

Always use these variables for z-index — never raw numbers like `9999`.

---

## 2. Global Element Styles

These styles apply automatically — no classes needed:

| Element | Style |
| --- | --- |
| `*` | `margin: 0; padding: 0; box-sizing: border-box` |
| `html, body` | Full height, system font (`system-ui, -apple-system, ...`), `--color-bg` background, `--color-text` text, `scrollbar-gutter: stable`, `line-height: 1.6`, `-webkit-font-smoothing: antialiased`, custom scrollbar |
| `a` | `cursor: pointer`, no underline (underline on hover) |
| `button` | Uses `@include button` (see mixins section) |
| `h1, h2, h3` | `font-weight: 600`, `--color-text`, `letter-spacing: -0.015em`, `line-height: 1.25` |
| `.container` | Centered wrapper, `width: min(100%, 1200px)`, `--space-md` padding |
| `.app-page-header` | Flex row, `align-items: flex-start`, `justify-content: space-between`, `gap: var(--space-md)`, `flex-wrap: wrap` |
| `.app-page-header__content` | CSS grid, `gap: var(--space-xs)` |
| `.app-back-button` | `display: inline-flex`, `align-items: center`, `gap: var(--space-xs)` |
| `.inline-edit-input` | Styled editable input with `--color-primary` border, `--color-primary-soft` box-shadow, `min-width: 200px`, inherits font |

---

## 3. Utility Classes

All utility classes are defined in `utilities.scss` and are available globally in any template.

### Display

```html
<div class="d-block">        /* display: block */
<div class="d-inline-block"> /* display: inline-block */
<div class="d-inline">       /* display: inline */
<div class="d-flex">         /* display: flex */
<div class="d-grid">         /* display: grid */
<div class="d-inline-flex">  /* display: inline-flex */
<div class="d-inline-grid">  /* display: inline-grid */
<div class="d-table">        /* display: table */
<div class="d-none">         /* display: none */
<div class="d-contents">     /* display: contents */
```

### Flex Direction

```html
<div class="flex-row">       /* display: flex; flex-direction: row */
<div class="flex-column">    /* display: flex; flex-direction: column */
```

> Note: these only set the `flex-direction`. You need to set `d-flex` separately.

### Flex Wrap

```html
<div class="flex-wrap-wrap">         /* flex-wrap: wrap */
<div class="flex-wrap-nowrap">       /* flex-wrap: nowrap */
<div class="flex-wrap-wrap-reverse"> /* flex-wrap: wrap-reverse */
```

### Alignment

**justify-content:**

```html
<div class="justify-center">
<div class="justify-space-between">
<div class="justify-space-around">
<div class="justify-space-evenly">
<div class="justify-flex-start">
<div class="justify-flex-end">
```

**align-items:**

```html
<div class="items-center">
<div class="items-space-between">
<div class="items-flex-start">
<div class="items-flex-end">
```

Also available: `justify-items-*` and `content-*` with the same values.

### Spacing Utilities

Spacing values: **1–8** (in rem) and **auto**.

Example for `1` = `1rem`:

```text
m-1     → margin: 1rem            (all sides)
mx-1    → margin-left & right
my-1    → margin-top & bottom
ml-1    → margin-left
mr-1    → margin-right
mt-1    → margin-top
mb-1    → margin-bottom
p-1     → padding: 1rem
px-1    → padding-left & right
py-1    → padding-top & bottom
pl-1    → padding-left
pr-1    → padding-right
pt-1    → padding-top
pb-1    → padding-bottom
```

Replace `1` with any number `1` through `8` (e.g. `m-3`, `px-2`, `mt-8`).

For `auto`:

```html
<div class="m-auto">    /* margin: auto */
<div class="mx-auto">   /* margin: 0 auto (horizontal centering) */
<div class="ml-auto">   /* margin-left: auto (push right) */
```

### Gap

```html
<div class="gap-1">   /* gap: 1rem */
<div class="gap-2">   /* gap: 2rem */
<div class="gap-auto"> /* gap: auto */
```

Replace with number `1` through `8`.

### Font Weight

```html
<span class="fw-100">  /* font-weight: 100 */
<span class="fw-400">  /* font-weight: 400 (normal) */
<span class="fw-600">  /* font-weight: 600 (semibold) */
<span class="fw-700">  /* font-weight: 700 (bold) */
```

Available: `100, 200, 300, 400, 500, 600, 700`

### Font Size

```html
<span class="fs-sm">  /* font-size: var(--font-size-sm) */
<span class="fs-md">  /* font-size: var(--font-size-md) */
<span class="fs-lg">  /* font-size: var(--font-size-lg) */
<span class="fs-xl">  /* font-size: var(--font-size-xl) */
```

### Text Alignment

```html
<p class="text-left">
<p class="text-center">
<p class="text-right">
```

### Border Radii

```html
<div class="radius-none">  /* border-radius: 0 */
<div class="radius-sm">    /* border-radius: var(--radius-sm) — 4px */
<div class="radius-md">    /* border-radius: var(--radius-md) — 6px */
<div class="radius-lg">    /* border-radius: var(--radius-lg) — 8px */
<div class="radius-xl">    /* border-radius: var(--radius-xl) — 12px */
<div class="radius-2xl">   /* border-radius: var(--radius-2xl) — 16px */
<div class="radius-full">  /* border-radius: 9999px — pill shape */
```

### Width / Height

```html
<div class="w-full">   /* width: 100% */
<div class="w-auto">   /* width: auto */
<div class="w-min">    /* width: min-content */
<div class="w-max">    /* width: max-content */
<div class="w-available"> /* width: stretch (fill available space) */

<div class="h-full">   /* height: 100% */
<div class="h-auto">   /* height: auto */
<div class="h-min">    /* height: min-content */
<div class="h-max">    /* height: max-content */
```

### Max-width

```html
<div class="mw-500">   /* max-width: 500px */
<div class="mw-600">   /* max-width: 600px */
<div class="mw-700">   /* max-width: 700px */
<div class="mw-900">   /* max-width: 900px */
<div class="mw-1200">  /* max-width: 1200px */
```

### Background Colors

```html
<div class="bg-canvas">       /* background: var(--color-bg) */
<div class="bg-surface">      /* background: var(--color-surface) */
<div class="bg-surface-hover"> /* background: var(--color-surface-hover) */
<div class="bg-primary">      /* background: var(--color-primary) */
<div class="bg-primary-hover"> /* background: var(--color-primary-hover) */
<div class="bg-primary-soft"> /* background: var(--color-primary-soft) */
<div class="bg-secondary">    /* background: var(--color-bg-secondary) */
<div class="bg-tertiary">     /* background: var(--color-bg-tertiary) */
<div class="bg-nav">          /* background: var(--color-nav-bg) */
<div class="bg-transparent">  /* background: transparent */
<div class="bg-success">      /* background: var(--color-success) */
<div class="bg-warning">      /* background: var(--color-warning) */
<div class="bg-danger">       /* background: var(--color-danger) */
```

### Text Colors

```html
<span class="text-body">       /* color: var(--color-text) */
<span class="text-secondary">  /* color: var(--color-text-secondary) */
<span class="text-muted">      /* color: var(--color-text-muted) */
<span class="text-light">      /* color: var(--color-text-light) */
<span class="text-primary">    /* color: var(--color-primary) */
<span class="text-primary-hover"> /* color: var(--color-primary-hover) */
<span class="text-nav">        /* color: var(--color-nav-text) */
<span class="text-white">      /* color: white */
<span class="text-success">    /* color: var(--color-success) */
<span class="text-warning">    /* color: var(--color-warning) */
<span class="text-danger">     /* color: var(--color-danger) */
```

### Cursor

```html
<div class="cursor-pointer">     /* cursor: pointer */
<div class="cursor-default">     /* cursor: default */
<div class="cursor-not-allowed"> /* cursor: not-allowed */
<div class="cursor-wait">        /* cursor: wait */
<div class="cursor-text">        /* cursor: text */
```

### Object-fit

```html
<img class="object-cover">       /* object-fit: cover */
<img class="object-contain">     /* object-fit: contain */
<img class="object-fill">        /* object-fit: fill */
<img class="object-scale-down">  /* object-fit: scale-down */
<img class="object-none">        /* object-fit: none */
<img class="object-center">      /* object-position: center */
<img class="object-top">         /* object-position: top */
```

### White-space

```html
<span class="text-nowrap">   /* white-space: nowrap (no line break) */
<span class="text-wrap">     /* white-space: normal */
<span class="text-prewrap">  /* white-space: pre-wrap */
<span class="text-truncate"> /* truncate with ellipsis (...) */
```

`.text-truncate` combines `overflow: hidden`, `text-overflow: ellipsis`, and `white-space: nowrap`.

---

## 4. Mixins

Mixins are defined in `utilities-mixin.scss`. They provide reusable CSS patterns to use inside component `.scss` files.

### Using Mixins

1. Add `@use` at the top of your component's `.scss` file:

   ```scss
   @use 'utilities-mixin' as *;
   ```

2. Include any mixin inside a selector:

   ```scss
   .my-component {
     @include card;
   }
   ```

> The `stylePreprocessorOptions` in `angular.json` is already configured to resolve `@use 'utilities-mixin'` to `src/utilities-mixin.scss`, so no relative paths needed.

### card

Standard card with surface background, border, shadow, and padding:

```scss
@include card;
```

Output:

```css
background: var(--color-surface);
border: 1px solid var(--color-border);
border-radius: var(--radius-md);
padding: var(--space-lg);
box-shadow: var(--shadow-elevated);
```

### button

Base button style (already applied globally to all `<button>` elements, but can be used for custom elements):

```scss
.my-custom-button {
  @include button;
}
```

Output:

```css
cursor: pointer;
border: none;
border-radius: var(--radius-md);
padding: var(--space-sm) var(--space-md);
background: var(--color-primary);
color: #fff;
font-size: var(--font-size-sm);
font-weight: 500;
white-space: nowrap;
box-shadow: var(--shadow-sm);
transition: background 180ms ease, transform 120ms ease, box-shadow 180ms ease;

&:hover {
  background: var(--color-primary-hover);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

&:active {
  transform: translateY(0);
  box-shadow: var(--shadow-xs);
}

&:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 3px;
}
```

### list

A vertical list with clickable items:

```scss
.my-list {
  @include list;
}
```

Output:

```css
display: flex;
flex-direction: column;
list-style-type: none;
gap: var(--space-sm);

li {
  background: var(--color-bg-primary);
  color: var(--color-text);
  padding: var(--space-md);
  border: 1px solid var(--color-border-light);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-xs);
  transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
}

li:hover {
  cursor: pointer;
  border-color: var(--color-primary);
  box-shadow: var(--shadow-sm);
  transform: translateY(-1px);
  color: var(--color-text);
}
```

### custom-scrollbar

Custom scrollbar styling (already applied to `html, body` globally, but can be used on any scrollable element):

```scss
.scrollable-panel {
  @include custom-scrollbar;
}
```

Output:

```css
scrollbar-width: thin;
scrollbar-color: var(--gh-scrollbar-thumb) var(--gh-scrollbar-track);

&::-webkit-scrollbar {
  width: var(--scrollbar-size);
  height: var(--scrollbar-size);
}

&::-webkit-scrollbar-track {
  background: var(--gh-scrollbar-track);
}

&::-webkit-scrollbar-thumb {
  background: var(--gh-scrollbar-thumb);
  border-radius: 999px;
  border: 2px solid var(--gh-scrollbar-track);
}

&::-webkit-scrollbar-thumb:hover {
  background: var(--gh-scrollbar-thumb-hover);
}
```

### search-input

Styled search/filter input field:

```scss
input[type="search"] {
  @include search-input;
}
```

Output:

```css
padding: 0.6rem 1rem;
border-radius: var(--radius-md);
border: 1px solid var(--color-border);
background: var(--color-surface);
color: var(--color-text);
font-size: var(--font-size-md);
width: min(100%, 260px);
transition: 0.2s;

&::placeholder {
  color: var(--color-text-muted);
  opacity: 1;
}

&:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-bg);
}

/* Responsive: smaller on mobile */
@media (max-width: 600px) {
  padding: 0.3rem 0.5rem;
  width: min(100%, 150% - 2.5rem);
}
```

### search-bar

A complete search bar component — an auto-aligned wrapper containing a search input:

```scss
.title-search {
  @include search-bar;
}
```

Output:

```css
margin-left: auto;
display: flex;
align-items: center;

input[type="search"] {
  @include search-input;
}
```

---

## 5. Dark Mode

Dark mode is automatic — the browser detects `prefers-color-scheme: dark` and applies the dark `:root` overrides defined in `styles.scss`.

**You don't need to write any dark-mode-specific code** because all `--color-*` variables update automatically. Just use the CSS variables/utilities and dark mode is handled.

❌ Don't do this:

```scss
.my-element {
  color: black;
  @media (prefers-color-scheme: dark) {
    color: white;
  }
}
```

✅ Do this:

```scss
.my-element {
  color: var(--color-text);
}
```

---

## Quick Reference

**Most common patterns in templates:**

```html
<!-- Card layout -->
<section class="bg-surface radius-md p-lg shadow-elevated">

<!-- Flex column with gap -->
<div class="flex-column gap-2">

<!-- Centered container with max width -->
<div class="mw-900 mx-auto">

<!-- Small text with muted color -->
<p class="text-muted fs-sm">

<!-- Pill badge -->
<span class="bg-primary text-white radius-full px-2 py-1 fs-sm">

<!-- Truncated text -->
<span class="text-truncate d-block w-full">

<!-- Clickable item -->
<div class="cursor-pointer">

<!-- Profile image -->
<img class="object-cover radius-full w-full h-auto">

<!-- Action buttons bar -->
<div class="d-flex gap-2 justify-space-between items-center">
```

**Most common patterns in component SCSS:**

```scss
@use 'utilities-mixin' as *;

.my-card {
  @include card;
}

.my-dropdown {
  @include custom-scrollbar;
}
