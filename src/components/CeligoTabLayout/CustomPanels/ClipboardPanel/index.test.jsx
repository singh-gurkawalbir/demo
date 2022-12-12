/* global describe, test, expect */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import { fireEvent, screen } from '@testing-library/react';
import {renderWithProviders} from '../../../../test/test-utils';
import ClipboardPanel from '.';

const props = {
  content: {
    test: 'value1',
    test1: 'value2',
    test2: 'value3',
  },
};

describe('Testing Clipboard Panel', () => {
  test('testing the Clipboard Panel by giving content as Object', async () => {
    renderWithProviders(
      <MemoryRouter>
        <ClipboardPanel {...props} />
      </MemoryRouter>
    );
    const value1 = screen.getByText('Copy');

    expect(value1).toBeInTheDocument();
    fireEvent.click(value1);

    const value2 = screen.getByText('Copied to clipboard');

    expect(value2).toBeInTheDocument();
  });

  test('testing the Clipboard Panel by string as Content', async () => {
    renderWithProviders(
      <MemoryRouter>
        <ClipboardPanel {...{...props, content: 'test'}} />
      </MemoryRouter>
    );
    const value1 = screen.getByText('Copy');

    expect(value1).toBeInTheDocument();
    fireEvent.click(value1);

    const value2 = screen.getByText('Copied to clipboard');

    expect(value2).toBeInTheDocument();
  });
});
