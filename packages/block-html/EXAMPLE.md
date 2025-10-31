# Block HTML - Examples

## Example 1: Raw HTML Mode (Default)

Chế độ mặc định - render HTML trực tiếp:

```tsx
import { Html } from '@usewaypoint/block-html';

<Html
  props={{
    contents: '<p>Hello <strong>World</strong></p>'
  }}
/>
```

## Example 2: Markdown Mode với Rich Text Editing

Bật markdown mode để edit màu sắc, font size từng chữ:

```tsx
import { Html } from '@usewaypoint/block-html';

<Html
  style={{
    fontSize: 16,
    color: '#000000'
  }}
  props={{
    markdown: true,  // ⭐ Bật markdown mode
    contents: '**Bold text** và *italic text*'
  }}
/>
```

## Example 3: Màu sắc từng chữ trong Markdown Mode

```tsx
<Html
  props={{
    markdown: true,
    contents: `
      Đây là text bình thường.
      
      <span style="color: #ff0000;">Chữ màu đỏ</span>
      
      <span style="color: #0000ff; font-size: 24px;">Chữ màu xanh và to hơn</span>
      
      <span style="color: #00ff00; font-weight: bold;">Chữ màu xanh lá và đậm</span>
    `
  }}
/>
```

## Example 4: Kết hợp Markdown và Inline HTML

```tsx
<Html
  style={{
    fontSize: 14,
    padding: { top: 20, bottom: 20, left: 10, right: 10 }
  }}
  props={{
    markdown: true,
    contents: `
      # Tiêu đề chính
      
      **Đây là text đậm** và *đây là text nghiêng*
      
      <span style="color: #ff0000; font-size: 18px;">Chữ màu đỏ size 18</span>
      
      - Danh sách item 1
      - Danh sách item 2
      
      [Link đến website](https://example.com)
      
      <div style="background-color: #f0f0f0; padding: 10px;">
        <span style="color: #333; font-weight: bold;">Box với background</span>
      </div>
    `
  }}
/>
```

## Example 5: Table với màu sắc

```tsx
<Html
  props={{
    markdown: true,
    contents: `
      | Tên | <span style="color: #ff0000;">Giá</span> | <span style="color: #00ff00;">Trạng thái</span> |
      |-----|------|-----------|
      | Sản phẩm A | <span style="color: #ff0000; font-weight: bold;">$100</span> | <span style="color: #00ff00;">Còn hàng</span> |
      | Sản phẩm B | <span style="color: #ff0000; font-weight: bold;">$200</span> | <span style="color: #ff9900;">Sắp hết</span> |
    `
  }}
/>
```

## Example 6: Multiple Font Sizes

```tsx
<Html
  props={{
    markdown: true,
    contents: `
      <span style="font-size: 24px; font-weight: bold;">Tiêu đề lớn</span>
      
      <span style="font-size: 16px;">Text bình thường</span>
      
      <span style="font-size: 12px; color: #666;">Text nhỏ màu xám</span>
      
      <span style="font-size: 32px; color: #ff0000; font-weight: bold;">CHỮ CỰC LỚN ĐỎ</span>
    `
  }}
/>
```

## Lợi ích của Markdown Mode:

✅ Edit được màu sắc từng chữ, từng ký tự
✅ Thay đổi font size linh hoạt
✅ Kết hợp markdown syntax với inline HTML
✅ Tạo tables, lists, links dễ dàng
✅ Format bold, italic, underline
✅ Thêm background color cho từng phần text
✅ An toàn hơn với HTML sanitizer

## So sánh 2 chế độ:

### Raw HTML Mode (markdown: false hoặc không set)
- Render HTML trực tiếp
- Không xử lý markdown
- Phù hợp khi bạn có sẵn HTML hoàn chỉnh

### Markdown Mode (markdown: true)
- Hỗ trợ markdown syntax
- Có thể dùng inline HTML để style từng chữ
- HTML được sanitize (an toàn hơn)
- Phù hợp cho rich text editing
