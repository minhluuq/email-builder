import React, { useState } from 'react';

import { DataObjectOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';

import ImportJsonDialog from './ImportJsonDialog';

export default function ImportJson() {
  const [open, setOpen] = useState(false);

  let dialog = null;
  if (open) {
    dialog = <ImportJsonDialog onClose={() => setOpen(false)} />;
  }

  return (
    <>
      <Tooltip title="Import JSON template">
        <IconButton onClick={() => setOpen(true)}>
          <DataObjectOutlined fontSize="small" />
        </IconButton>
      </Tooltip>
      {dialog}
    </>
  );
}
