import { useEffect, useRef, useState } from 'react';

import {
  FormatBold,
  FormatColorText,
  FormatItalic,
  FormatSize,
  FormatUnderlined,
  Highlight,
  Link as LinkIcon,
} from '@mui/icons-material';
import { Box, Button, IconButton, Popover, Stack, TextField, Tooltip } from '@mui/material';

import { HexColorPicker } from 'react-colorful';

type Props = {
  label: string;
  defaultValue: string;
  onChange: (value: string) => void;
};

// Preset colors for quick selection
const PRESET_COLORS = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#008000', '#FFC0CB', '#A52A2A', '#808080', '#FFD700',
];

const PRESET_HIGHLIGHTS = [
  '#FFFF00', '#00FF00', '#00FFFF', '#FF00FF', '#FFA500',
  '#FFD700', '#90EE90', '#87CEEB', '#DDA0DD', '#F0E68C',
  '#FFB6C1', '#FFDAB9', '#E0BBE4', '#C7CEEA', '#B0E57C',
];

export default function RichTextEditor({ label, defaultValue, onChange }: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [colorAnchor, setColorAnchor] = useState<HTMLElement | null>(null);
  const [highlightAnchor, setHighlightAnchor] = useState<HTMLElement | null>(null);
  const [sizeAnchor, setSizeAnchor] = useState<HTMLElement | null>(null);
  const [linkAnchor, setLinkAnchor] = useState<HTMLElement | null>(null);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedHighlight, setSelectedHighlight] = useState('#FFFF00');
  const [fontSize, setFontSize] = useState('16');
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    if (editorRef.current && defaultValue !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = defaultValue;
    }
  }, [defaultValue]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const applyColor = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      // Use HEX color directly - ensures output is HEX not RGB
      span.style.color = selectedColor;

      try {
        // Extract the selected content
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);

        // Clear selection and trigger update
        selection.removeAllRanges();
        handleInput();
      } catch (e) {
        console.error('Error applying color:', e);
      }
    }
    setColorAnchor(null);
  };

  const applyHighlight = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      // Use HEX for background color
      span.style.backgroundColor = selectedHighlight;

      try {
        // Extract the selected content
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);

        // Clear selection and trigger update
        selection.removeAllRanges();
        handleInput();
      } catch (e) {
        console.error('Error applying highlight:', e);
      }
    }
    setHighlightAnchor(null);
  };

  const applyFontSize = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && !selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.fontSize = `${fontSize}px`;

      try {
        // Extract the selected content
        const contents = range.extractContents();
        span.appendChild(contents);
        range.insertNode(span);

        // Clear selection and trigger update
        selection.removeAllRanges();
        handleInput();
      } catch (e) {
        console.error('Error applying font size:', e);
      }
    }
    setSizeAnchor(null);
  };

  const applyLink = () => {
    if (linkUrl) {
      execCommand('createLink', linkUrl);
      setLinkUrl('');
    }
    setLinkAnchor(null);
  };

  return (
    <Box>
      <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>{label}</Box>

      {/* Toolbar */}
      <Stack direction="row" spacing={0.5} sx={{ mb: 1, flexWrap: 'wrap', gap: 0.5 }}>
        <Tooltip title="Bold (Ctrl+B)">
          <IconButton size="small" onClick={() => execCommand('bold')}>
            <FormatBold fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Italic (Ctrl+I)">
          <IconButton size="small" onClick={() => execCommand('italic')}>
            <FormatItalic fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Underline (Ctrl+U)">
          <IconButton size="small" onClick={() => execCommand('underline')}>
            <FormatUnderlined fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Text Color">
          <IconButton size="small" onClick={(e) => setColorAnchor(e.currentTarget)}>
            <FormatColorText fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Highlight Color">
          <IconButton size="small" onClick={(e) => setHighlightAnchor(e.currentTarget)}>
            <Highlight fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Font Size">
          <IconButton size="small" onClick={(e) => setSizeAnchor(e.currentTarget)}>
            <FormatSize fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Add Link">
          <IconButton size="small" onClick={(e) => setLinkAnchor(e.currentTarget)}>
            <LinkIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Editor */}
      <Box
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          p: 1.5,
          minHeight: 150,
          maxHeight: 300,
          overflow: 'auto',
          '&:focus': {
            outline: '2px solid',
            outlineColor: 'primary.main',
            outlineOffset: -1,
          },
          '& *': {
            margin: 0,
          },
        }}
      />

      {/* Color Picker Popover */}
      <Popover
        open={Boolean(colorAnchor)}
        anchorEl={colorAnchor}
        onClose={() => setColorAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, width: 250 }}>
          <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>Text Color</Box>
          
          {/* Preset Colors */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 1 }}>Quick Colors</Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {PRESET_COLORS.map((color) => (
                <Box
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  sx={{
                    width: 28,
                    height: 28,
                    backgroundColor: color,
                    border: selectedColor === color ? '3px solid' : '1px solid',
                    borderColor: selectedColor === color ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': { transform: 'scale(1.1)' },
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* HEX Input */}
          <TextField
            fullWidth
            label="HEX Color"
            value={selectedColor}
            onChange={(e) => {
              const value = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                setSelectedColor(value);
              }
            }}
            size="small"
            sx={{ mb: 2 }}
            placeholder="#000000"
          />

          {/* Color Picker */}
          <HexColorPicker color={selectedColor} onChange={setSelectedColor} style={{ width: '100%' }} />
          
          <Button fullWidth variant="contained" onClick={applyColor} sx={{ mt: 2 }}>
            Apply Color
          </Button>
        </Box>
      </Popover>

      {/* Highlight Color Picker Popover */}
      <Popover
        open={Boolean(highlightAnchor)}
        anchorEl={highlightAnchor}
        onClose={() => setHighlightAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, width: 250 }}>
          <Box sx={{ mb: 1, fontSize: '0.875rem', fontWeight: 500 }}>Highlight Color</Box>
          
          {/* Preset Highlight Colors */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 1 }}>Quick Highlights</Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {PRESET_HIGHLIGHTS.map((color) => (
                <Box
                  key={color}
                  onClick={() => setSelectedHighlight(color)}
                  sx={{
                    width: 28,
                    height: 28,
                    backgroundColor: color,
                    border: selectedHighlight === color ? '3px solid' : '1px solid',
                    borderColor: selectedHighlight === color ? 'primary.main' : 'divider',
                    borderRadius: 1,
                    cursor: 'pointer',
                    '&:hover': { transform: 'scale(1.1)' },
                    transition: 'all 0.2s',
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* HEX Input */}
          <TextField
            fullWidth
            label="HEX Color"
            value={selectedHighlight}
            onChange={(e) => {
              const value = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                setSelectedHighlight(value);
              }
            }}
            size="small"
            sx={{ mb: 2 }}
            placeholder="#FFFF00"
          />

          {/* Color Picker */}
          <HexColorPicker color={selectedHighlight} onChange={setSelectedHighlight} style={{ width: '100%' }} />
          
          <Button fullWidth variant="contained" onClick={applyHighlight} sx={{ mt: 2 }}>
            Apply Highlight
          </Button>
        </Box>
      </Popover>

      {/* Font Size Popover */}
      <Popover
        open={Boolean(sizeAnchor)}
        anchorEl={sizeAnchor}
        onClose={() => setSizeAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, width: 200 }}>
          <TextField
            fullWidth
            label="Font Size (px)"
            type="number"
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value)}
            size="small"
          />
          <Button fullWidth variant="contained" onClick={applyFontSize} sx={{ mt: 2 }}>
            Apply Size
          </Button>
        </Box>
      </Popover>

      {/* Link Popover */}
      <Popover
        open={Boolean(linkAnchor)}
        anchorEl={linkAnchor}
        onClose={() => setLinkAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 2, width: 300 }}>
          <TextField
            fullWidth
            label="URL"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            size="small"
          />
          <Button fullWidth variant="contained" onClick={applyLink} sx={{ mt: 2 }}>
            Insert Link
          </Button>
        </Box>
      </Popover>

      <Box sx={{ mt: 1, fontSize: '0.75rem', color: 'text.secondary' }}>
        💡 Select text and use toolbar to format. Supports bold, italic, text color, highlight, font sizes, and links.
      </Box>
    </Box>
  );
}
