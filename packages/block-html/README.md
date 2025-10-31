# @usewaypoint/block-html

HTML component for use with the EmailBuilder package.

## Features

- **Two modes**: Raw HTML mode and Markdown mode
- **Rich Text Editing**: In markdown mode, you can edit colors, font sizes, and styling of individual words and characters
- **Flexible Styling**: Supports font family, font size, font weight, text alignment, colors, and padding

## Usage

### Raw HTML Mode (Default)

```tsx
import { Html } from '@usewaypoint/block-html';

<Html
  style={{
    color: '#000000',
    backgroundColor: '#ffffff',
    fontSize: 16,
    padding: { top: 10, bottom: 10, left: 20, right: 20 }
  }}
  props={{
    contents: '<p>Your <strong>HTML</strong> content here</p>'
  }}
/>
```

### Markdown Mode (Rich Text Editing)

Enable markdown mode to edit individual text formatting:

```tsx
import { Html } from '@usewaypoint/block-html';

<Html
  style={{
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: { top: 10, bottom: 10, left: 20, right: 20 }
  }}
  props={{
    markdown: true,  // Enable markdown mode
    contents: 'Your **bold** text with <span style="color: red;">colored</span> words'
  }}
/>
```

## Props

### Style Properties
- `color`: Text color (hex format)
- `backgroundColor`: Background color (hex format)
- `fontFamily`: Font family (e.g., 'MODERN_SANS', 'BOOK_SERIF', etc.)
- `fontSize`: Font size in pixels
- `fontWeight`: Font weight ('bold' or 'normal')
- `textAlign`: Text alignment ('left', 'center', 'right')
- `padding`: Padding object with top, bottom, left, right values

### Props Properties
- `contents`: HTML or markdown content
- `markdown`: Boolean to enable markdown/rich text mode (default: false)

## Markdown Mode Features

When `markdown` is enabled, you can:
- Use markdown syntax (bold, italic, links, etc.)
- Use inline HTML for advanced styling
- Format individual words with different colors and sizes
- Create tables, lists, and more

Example with rich formatting:
```markdown
# Heading 1
**Bold text** and *italic text*

<span style="color: #ff0000; font-size: 20px;">Red and bigger text</span>

[Link text](https://example.com)
```
