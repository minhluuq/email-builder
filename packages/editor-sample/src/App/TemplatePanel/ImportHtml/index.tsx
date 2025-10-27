import React, { useState } from 'react';
import { FileUploadOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import ImportHtmlDialog from '../ImportHtmlDialog';

export default function ImportHtml() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Tooltip title="Import HTML">
        <IconButton onClick={() => setOpen(true)}>
          <FileUploadOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
      {open && <ImportHtmlDialog onClose={() => setOpen(false)} />}
    </>
  );
}
