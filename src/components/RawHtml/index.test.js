/* global describe, jest, test, expect */
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../test/test-utils';
import RawHtml from '.';

async function initRawHtml(props = {}) {
  const ui = (
    <MemoryRouter>
      <RawHtml {...props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('Test suite for RawHtml component', () => {
  test('tags not allowed should not be applied', async () => {
    const options = {allowedTags: ['a']};
    const html = '<a href="https://www.celigo.com/">Hello <p>World</p></a>';

    await initRawHtml({html, options});
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  test('tags allowed should be applied', async () => {
    const options = {allowedTags: ['a', 'p']};
    const html = '<a href="https://www.celigo.com/">Hello <p>World</p></a>';
    const {utils} = await initRawHtml({html, options});

    expect(utils.container.querySelector('p').textContent).toEqual('World');
    expect(screen.getByRole('link')).toHaveTextContent('Hello World');
  });

  test('should pass the provided props', async () => {
    const onClick = jest.fn();
    const options = {allowedTags: ['button']};
    const html = '<button>clickMe</button>';

    await initRawHtml({html, options, onClick});
    const button = screen.getByRole('button', {name: 'clickMe'});

    expect(onClick).toHaveBeenCalledTimes(0);
    userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  test('should pass the render when options is an empty object', async () => {
    const html = '<>This is <strong>not</strong> working.</>';

    await initRawHtml({html});
    expect(screen.getByText(/working/i)).toBeInTheDocument();
  });
});
