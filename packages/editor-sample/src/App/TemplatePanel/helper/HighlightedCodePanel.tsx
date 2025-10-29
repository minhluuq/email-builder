import React, { useEffect, useState } from 'react';
import { Box, IconButton, Tooltip, Alert } from '@mui/material';
import { ContentCopyOutlined } from '@mui/icons-material';

import { html, json } from './highlighters';

type TextEditorPanelProps = {
  type: 'json' | 'html' | 'javascript';
  value: string;
};

export default function HighlightedCodePanel({ type, value }: TextEditorPanelProps) {
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    switch (type) {
      case 'html':
        html(value).then(setCode);
        return;
      case 'json':
        json(value).then(setCode);
        return;
    }
  }, [setCode, value, type]);

  const formatHtml = (html: string): string => {
    // Enhanced HTML formatter
    let formatted = html;

    // Remove all existing whitespace between tags
    formatted = formatted.replace(/>\s+</g, '><');

    // Add line breaks after opening tags and before closing tags
    formatted = formatted.replace(/>/g, '>\n');
    formatted = formatted.replace(/<\//g, '\n</');

    // Split into lines and process each line
    const lines = formatted.split('\n');
    let indentLevel = 0;
    const indentedLines: string[] = [];

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      // Handle closing tags - decrease indent first
      if (trimmedLine.startsWith('</')) {
        indentLevel = Math.max(0, indentLevel - 1);
      }

      // Add the indented line
      indentedLines.push('  '.repeat(indentLevel) + trimmedLine);

      // Handle opening tags - increase indent after adding line
      if (
        trimmedLine.startsWith('<') &&
        !trimmedLine.startsWith('</') &&
        !trimmedLine.endsWith('/>') &&
        !trimmedLine.match(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)/i)
      ) {
        // Check if it's not a self-contained tag (has both opening and closing)
        const tagName = trimmedLine.match(/<(\w+)/)?.[1];
        if (tagName && !trimmedLine.includes(`</${tagName}>`)) {
          indentLevel++;
        }
      }
    }

    return indentedLines.join('\n');
  };

  const formatJson = (jsonStr: string): string => {
    try {
      const parsed = JSON.parse(jsonStr);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonStr;
    }
  };

  const handleCopy = async () => {
    try {
      let formattedValue = value;

      if (type === 'html') {
        formattedValue = formatHtml(value);
      } else if (type === 'json') {
        formattedValue = formatJson(value);
      }

      await navigator.clipboard.writeText(formattedValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  if (code === null) {
    return null;
  }

  return (
    <Box sx={{ position: 'relative', height: '100%', overflow: 'auto' }}>
      {/* Copy Button */}
      <Box
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10,
        }}
      >
        <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
          <IconButton
            onClick={handleCopy}
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 1)',
              },
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
            color={copied ? 'success' : 'default'}
          >
            <ContentCopyOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Success Alert */}
      {copied && (
        <Box
          sx={{
            position: 'absolute',
            top: 50,
            right: 8,
            zIndex: 10,
          }}
        >
          <Alert severity="success" sx={{ py: 0, fontSize: '0.75rem' }}>
            Code copied!
          </Alert>
        </Box>
      )}

      {/* Code Content */}
      <pre
        style={{
          margin: 0,
          padding: 16,
          paddingTop: 48, // Space for copy button
          minHeight: '100%',
          backgroundColor: '#f8f9fa',
          fontSize: '0.875rem',
          lineHeight: 1.5,
        }}
        dangerouslySetInnerHTML={{ __html: code }}
        onClick={(ev) => {
          const s = window.getSelection();
          if (s === null) {
            return;
          }
          s.selectAllChildren(ev.currentTarget);
        }}
      />
    </Box>
  );
}
