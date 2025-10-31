import React, { useState } from 'react';

import { HtmlProps, HtmlPropsSchema } from '@usewaypoint/block-html';

import BaseSidebarPanel from './helpers/BaseSidebarPanel';
import BooleanInput from './helpers/inputs/BooleanInput';
import RichTextEditor from './helpers/inputs/RichTextEditor';
import TextInput from './helpers/inputs/TextInput';
import MultiStylePropertyPanel from './helpers/style-inputs/MultiStylePropertyPanel';

type HtmlSidebarPanelProps = {
  data: HtmlProps;
  setData: (v: HtmlProps) => void;
};
export default function HtmlSidebarPanel({ data, setData }: HtmlSidebarPanelProps) {
  const [, setErrors] = useState<Zod.ZodError | null>(null);

  const updateData = (d: unknown) => {
    const res = HtmlPropsSchema.safeParse(d);
    if (res.success) {
      setData(res.data);
      setErrors(null);
    } else {
      setErrors(res.error);
    }
  };

  const isMarkdownMode = data.props?.markdown ?? false;

  return (
    <BaseSidebarPanel title="Html block">
      <BooleanInput
        label="Rich Text Editor Mode"
        defaultValue={isMarkdownMode}
        onChange={(markdown) => updateData({ ...data, props: { ...data.props, markdown } })}
      />

      {isMarkdownMode ? (
        <RichTextEditor
          label="Rich Text Content"
          defaultValue={data.props?.contents ?? ''}
          onChange={(contents) => updateData({ ...data, props: { ...data.props, contents } })}
        />
      ) : (
        <TextInput
          label="HTML Content"
          rows={5}
          defaultValue={data.props?.contents ?? ''}
          onChange={(contents) => updateData({ ...data, props: { ...data.props, contents } })}
        />
      )}

      <MultiStylePropertyPanel
        names={['color', 'backgroundColor', 'fontFamily', 'fontSize', 'fontWeight', 'textAlign', 'padding']}
        value={data.style}
        onChange={(style) => updateData({ ...data, style })}
      />
    </BaseSidebarPanel>
  );
}
