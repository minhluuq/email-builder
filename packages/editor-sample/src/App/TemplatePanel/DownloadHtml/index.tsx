import React, { useMemo } from 'react';
import { CodeOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { renderToStaticMarkup } from '@usewaypoint/email-builder';
import { useDocument } from '../../../documents/editor/EditorContext';

export default function DownloadHtml() {
  const doc = useDocument();
  const html = useMemo(() => renderToStaticMarkup(doc, { rootBlockId: 'root' }), [doc]);

  // Create email-ready HTML without template data
  const emailHtml = useMemo(() => {
    const emailReadyHtml = `<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <title>Email Template</title>
    <!--[if mso]>
    <noscript>
        <xml>
            <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
            </o:OfficeDocumentSettings>
        </xml>
    </noscript>
    <![endif]-->
    <style type="text/css">
        /* Client-specific Styles */
        #outlook a { padding: 0; }
        body { margin: 0; padding: 0; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        
        /* Reset styles */
        img { max-width: 100%; }
        .ExternalClass { width: 100%; }
        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div { line-height: 100%; }
        
        /* Responsive styles */
        @media screen and (max-width: 600px) {
            .mobile-center { text-align: center !important; }
            .mobile-padding { padding: 10px !important; }
            .mobile-width { width: 100% !important; max-width: 100% !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f4;">
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
        Email preview text goes here
    </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f4f4;">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; max-width: 600px;" class="mobile-width">
                    <tr>
                        <td>
                            ${html}
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;
    return emailReadyHtml;
  }, [html]);

  const href = useMemo(() => {
    return `data:text/html;charset=utf-8,${encodeURIComponent(emailHtml)}`;
  }, [emailHtml]);

  return (
    <Tooltip title="Download HTML for email (email client ready)">
      <IconButton href={href} download="email-template.html">
        <CodeOutlined fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
