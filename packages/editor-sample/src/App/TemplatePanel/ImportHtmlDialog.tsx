import React, { useState, useRef } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Box,
  Stack,
  Tab,
  Tabs,
} from '@mui/material';
import { CloudUploadOutlined } from '@mui/icons-material';
import { resetDocument } from '../../documents/editor/EditorContext';
import { TEditorConfiguration } from '../../documents/editor/core';

// Enhanced HTML to template parser with metadata detection
function parseHtmlToTemplate(html: string): { error?: string; data?: TEditorConfiguration } {
  try {
    const cleanHtml = html.trim();
    if (!cleanHtml) {
      return { error: 'Please enter valid HTML content.' };
    }

    // Try to extract embedded template data first
    const templateMatch = cleanHtml.match(
      /<!--EMAILBUILDER_TEMPLATE_START\s*([\s\S]*?)\s*EMAILBUILDER_TEMPLATE_END-->/
    );

    if (templateMatch) {
      try {
        // Found embedded template data - parse and return it
        const templateData = JSON.parse(templateMatch[1]);
        return { data: templateData };
      } catch (jsonError) {
        // If JSON parsing fails, fall back to HTML parsing
        console.warn('Failed to parse embedded template data, falling back to HTML parsing');
      }
    }

    // No embedded data found or parsing failed - create template from HTML
    // Extract HTML content from body if it's a full HTML document
    let htmlContent = cleanHtml;
    const bodyMatch = cleanHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      htmlContent = bodyMatch[1].trim();
    }

    // Create a basic template structure with HTML block
    const template: TEditorConfiguration = {
      root: {
        type: 'EmailLayout',
        data: {
          backdropColor: '#F8F8F8',
          canvasColor: '#FFFFFF',
          textColor: '#242424',
          fontFamily: 'MODERN_SANS',
          childrenIds: ['html-block-1'],
        },
      },
      'html-block-1': {
        type: 'Html',
        data: {
          style: {
            padding: {
              top: 16,
              bottom: 16,
              right: 24,
              left: 24,
            },
          },
          props: {
            contents: htmlContent,
          },
        },
      },
    };

    return { data: template };
  } catch (error) {
    return { error: 'Failed to parse HTML. Please check your HTML syntax.' };
  }
}

type ImportHtmlDialogProps = {
  onClose: () => void;
};

export default function ImportHtmlDialog({ onClose }: ImportHtmlDialogProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (ev) => {
    setValue(ev.currentTarget.value);
    setError(null);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/html' && !file.name.endsWith('.html')) {
      setError('Please select an HTML file (.html)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setValue(content);
      setError(null);
    };
    reader.onerror = () => {
      setError('Failed to read file');
    };
    reader.readAsText(file);
  };

  let errorAlert = null;
  if (error) {
    errorAlert = <Alert color="error">{error}</Alert>;
  }

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Import HTML</DialogTitle>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();
          const { error, data } = parseHtmlToTemplate(value);
          setError(error ?? null);
          if (!data) {
            return;
          }
          resetDocument(data);
          onClose();
        }}
      >
        <DialogContent>
          <Typography color="text.secondary" paragraph>
            Import HTML content as a template. You can paste HTML directly or upload an HTML file.
          </Typography>
          <Typography color="text.secondary" paragraph sx={{ fontSize: '0.875rem' }}>
            <strong>💡 Note:</strong> HTML will be converted to an editable template. For full template preservation,
            use JSON export/import instead.
          </Typography>

          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)}>
              <Tab label="Paste HTML" />
              <Tab label="Upload File" />
            </Tabs>
          </Box>

          {activeTab === 0 && (
            <>
              {errorAlert}
              <TextField
                error={error !== null}
                value={value}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                rows={12}
                multiline
                placeholder="<div>Your HTML content here...</div>"
                helperText="This will override your current template."
              />
            </>
          )}

          {activeTab === 1 && (
            <Stack spacing={2}>
              {errorAlert}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept=".html,text/html"
                style={{ display: 'none' }}
              />
              <Button
                variant="outlined"
                onClick={() => fileInputRef.current?.click()}
                startIcon={<CloudUploadOutlined />}
                sx={{ py: 2 }}
              >
                Choose HTML File
              </Button>
              {value && (
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Preview:
                  </Typography>
                  <TextField
                    value={value}
                    onChange={handleChange}
                    variant="outlined"
                    fullWidth
                    rows={8}
                    multiline
                    size="small"
                  />
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
        <DialogActions>
          <Button type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" disabled={error !== null || !value.trim()}>
            Import HTML
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
