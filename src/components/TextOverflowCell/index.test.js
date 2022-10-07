/* global describe, test, expect */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import TextOverflowCell from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders } from '../../test/test-utils';

async function initTextOverflowCell({
  props = {
    message: 'mock message',
  },
} = {}) {
  const ui = (
    <MemoryRouter>
      <TextOverflowCell {...props} />
    </MemoryRouter>
  );
  const { store, utils } = await renderWithProviders(ui);

  return {
    store,
    utils,
  };
}

describe('TextOverflowCell test cases', () => {
  runServer();

  test('should pass the initial render with default value/ with message', async () => {
    await initTextOverflowCell();

    expect(screen.queryByText(/mock message/i)).toBeInTheDocument();
  });

  test('should pass the initial render with html data', async () => {
    await initTextOverflowCell({
      props: {
        message: 'mock message',
        containsHtml: true,
        rawHtmlOptions: {allowedTags: ['a']},
      },
    });

    expect(screen.queryByText(/mock message/i)).toBeInTheDocument();
  });
});
