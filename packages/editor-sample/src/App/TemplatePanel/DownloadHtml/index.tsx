import React, { useMemo } from 'react';
import { FileDownloadOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import { useDocument } from '../../../documents/editor/EditorContext';

export default function DownloadHtml() {
  const doc = useDocument();
  const html = useMemo(() => renderToStaticMarkup(doc, { rootBlockId: 'root' }), [doc]);
  const href = useMemo(() => {
    return `data:text/html;charset=utf-8,${encodeURIComponent(html)}`;
  }, [html]);
  return (
    <Tooltip title="Download HTML file">
      <IconButton href={href} download="emailTemplate.html">
        <FileDownloadOutlined fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
