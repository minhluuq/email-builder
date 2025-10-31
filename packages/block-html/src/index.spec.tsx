import React from 'react';

import { render } from '@testing-library/react';

import { Html } from '.';

describe('block-html', () => {
  it('renders with default values', () => {
    expect(render(<Html />).asFragment()).toMatchSnapshot();
  });

  it('renders raw HTML content', () => {
    expect(
      render(
        <Html
          props={{
            contents: '<p>Hello <strong>World</strong></p>',
          }}
        />
      ).asFragment()
    ).toMatchSnapshot();
  });

  it('renders markdown content when markdown is enabled', () => {
    expect(
      render(
        <Html
          props={{
            markdown: true,
            contents: '**Bold text** and *italic text*',
          }}
        />
      ).asFragment()
    ).toMatchSnapshot();
  });

  it('applies custom styles', () => {
    expect(
      render(
        <Html
          style={{
            color: '#ff0000',
            backgroundColor: '#f0f0f0',
            fontSize: 18,
            fontWeight: 'bold',
            textAlign: 'center',
            padding: { top: 10, bottom: 20, left: 15, right: 15 },
          }}
          props={{
            contents: 'Styled content',
          }}
        />
      ).asFragment()
    ).toMatchSnapshot();
  });

  it('combines markdown mode with custom styles', () => {
    expect(
      render(
        <Html
          style={{
            color: '#0000ff',
            fontSize: 16,
            fontWeight: 'normal',
          }}
          props={{
            markdown: true,
            contents: 'Text with <span style="color: red;">colored words</span>',
          }}
        />
      ).asFragment()
    ).toMatchSnapshot();
  });
});
