import React, { useMemo } from 'react';
import { FileDownloadOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import { useDocument } from '../../../documents/editor/EditorContext';

export default function DownloadHtml() {
  const doc = useDocument();
  const html = useMemo(() => renderToStaticMarkup(doc, { rootBlockId: 'root' }), [doc]);

  // Create enhanced HTML with embedded template data for re-import
  const enhancedHtml = useMemo(() => {
    const templateData = JSON.stringify(doc, null, 2);
    const htmlWithMetadata = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Email Template</title>
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
    return `data:text/html;charset=utf-8,${encodeURIComponent(enhancedHtml)}`;
  }, [enhancedHtml]);

  return (
    <Tooltip title="Download HTML file (with template data for re-import)">
      <IconButton href={href} download="emailTemplate.html">
        <FileDownloadOutlined fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
