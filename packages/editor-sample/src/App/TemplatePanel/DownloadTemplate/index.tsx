import React, { useMemo } from 'react';
import { SaveOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import { useDocument } from '../../../documents/editor/EditorContext';

export default function DownloadTemplate() {
  const doc = useDocument();
  const html = useMemo(() => renderToStaticMarkup(doc, { rootBlockId: 'root' }), [doc]);

  // Create HTML with embedded template data for re-import (backup purpose)
  const templateHtml = useMemo(() => {
    const templateData = JSON.stringify(doc, null, 2);
    const htmlWithMetadata = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Email Template Backup</title>
    <!-- EmailBuilder Template Data - DO NOT MODIFY -->
    <!--EMAILBUILDER_TEMPLATE_START
${templateData}
EMAILBUILDER_TEMPLATE_END-->
</head>
<body>
${html}
</body>
</html>`;
    return htmlWithMetadata;
  }, [html, doc]);

  const href = useMemo(() => {
    return `data:text/html;charset=utf-8,${encodeURIComponent(templateHtml)}`;
  }, [templateHtml]);

  return (
    <Tooltip title="Download template backup (with editing data)">
      <IconButton href={href} download="template-backup.html">
        <SaveOutlined fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
