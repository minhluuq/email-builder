import React, { useRef, useState } from 'react';

import { CloudUploadOutlined, DeleteOutlined, LinkOutlined } from '@mui/icons-material';
import { Box, Button, IconButton, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';

type ImageUploadProps = {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  accept?: string;
};

export default function ImageUpload({ label, value, onChange, accept = 'image/*' }: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string>(value || '');
  const [activeTab, setActiveTab] = useState(0);
  const [urlInput, setUrlInput] = useState(value?.startsWith('data:') ? '' : value || '');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
        onChange(result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      setIsUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setUrlInput(url);
    setPreview(url);
    onChange(url);
  };

  const handleRemove = () => {
    setPreview('');
    setUrlInput('');
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
        {label}
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} aria-label="image input tabs">
          <Tab label="Upload" />
          <Tab label="URL" />
        </Tabs>
      </Box>

      {/* Upload Tab */}
      {activeTab === 0 && (
        <Box>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept={accept}
            style={{ display: 'none' }}
          />

          <Button
            variant="outlined"
            onClick={handleButtonClick}
            disabled={isUploading}
            startIcon={isUploading ? undefined : <CloudUploadOutlined />}
            fullWidth
            sx={{
              py: 2,
              borderStyle: 'dashed',
              '&:hover': {
                borderStyle: 'dashed',
              },
            }}
          >
            {isUploading ? 'Uploading...' : 'Click to upload image'}
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Max file size: 5MB. Supported formats: JPG, PNG, GIF, WebP
          </Typography>
        </Box>
      )}

      {/* URL Tab */}
      {activeTab === 1 && (
        <Box>
          <TextField
            fullWidth
            size="small"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => handleUrlChange(e.target.value)}
            InputProps={{
              startAdornment: <LinkOutlined sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
          />
        </Box>
      )}

      {/* Preview */}
      {preview && (
        <Box sx={{ mt: 2, border: '1px solid #e0e0e0', borderRadius: 1, p: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 1,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                border: '1px solid #e0e0e0',
              }}
            >
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '❌ Invalid image';
                }}
              />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={500}>
                {preview.startsWith('data:') ? 'Uploaded file' : 'External image'}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  display: 'block',
                  wordBreak: 'break-all',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '100%',
                }}
                title={
                  preview.startsWith('data:')
                    ? `Base64 encoded (${Math.round((preview.length * 0.75) / 1024)}KB)`
                    : preview
                }
              >
                {preview.startsWith('data:')
                  ? `Base64 encoded (${Math.round((preview.length * 0.75) / 1024)}KB)`
                  : preview}
              </Typography>
            </Box>
            <IconButton size="small" onClick={handleRemove} color="error">
              <DeleteOutlined />
            </IconButton>
          </Stack>
        </Box>
      )}
    </Box>
  );
}
