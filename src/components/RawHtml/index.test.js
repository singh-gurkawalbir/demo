
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RawHtml from '.';
import { renderWithProviders } from '../../test/test-utils';

describe('test suite for RawHtml component', () => {
  test('tags not allowed should not be applied', () => {
    const options = {allowedTags: ['a']};
    const html = '<a href="https://www.celigo.com/">Hello <p>World</p></a>';

    renderWithProviders(<RawHtml html={html} options={options} />);
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  test('tags allowed should be applied', () => {
    const options = {allowedTags: ['a', 'p']};
    const html = '<a href="https://www.celigo.com/">Hello <p>World</p></a>';

    renderWithProviders(<RawHtml html={html} options={options} />);
    expect(document.querySelector('p').textContent).toBe('World');
    expect(screen.getByRole('link')).toHaveTextContent('Hello World');
  });

  test('should pass the provided props', async () => {
    const onClick = jest.fn();
    const options = {allowedTags: ['button']};
    const html = '<button>clickMe</button>';

    renderWithProviders(<RawHtml html={html} options={options} onClick={onClick} />);
    const button = screen.getByRole('button', {name: 'clickMe'});

    expect(onClick).toHaveBeenCalledTimes(0);
    await userEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
  test('should pass the render when options is an empty object', () => {
    const html = '<>This is <strong>not</strong> working.</>';

    renderWithProviders(<RawHtml html={html} />);
    expect(screen.getByText(/working/i)).toBeInTheDocument();
  });
});
