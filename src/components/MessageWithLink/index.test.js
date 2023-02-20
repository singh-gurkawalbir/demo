import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MessageWithLink from '.';
import { renderWithProviders } from '../../test/test-utils';

describe('MessageWithLink test cases', () => {
  test('should pass the initial render with default values', async () => {
    const props = {
      type: 'sometype',
      message: 'Some Notification Message',
      link: 'https://www.google.com/',
      linkText: 'somelinktext',
      instructionsLink: 'https://www.celigo.com/',
      className: 'someclassname',
      children: 'somechildren',
    };

    renderWithProviders(<MessageWithLink {...props} />);
    expect(screen.getByText('Some Notification Message')).toBeInTheDocument();
    const linkNode = document.querySelector('[href="https://www.google.com/"]');

    expect(linkNode).toBeInTheDocument();
    await userEvent.click(linkNode);
    expect(screen.getByText('somelinktext')).toBeInTheDocument();
    const instructionlink = document.querySelector('[href="https://www.celigo.com/"]');

    expect(instructionlink).toBeInTheDocument();
    await userEvent.click(instructionlink);
    expect(screen.getByText('View instructions')).toBeInTheDocument();
  });
  test('should not display view instructions option when instruction link is not provided', async () => {
    const props = {
      type: 'sometype',
      message: 'Some Notification Message',
      link: 'https://www.google.com/',
      linkText: 'somelinktext',
      className: 'someclassname',
      children: 'somechildren',
    };

    renderWithProviders(<MessageWithLink {...props} />);
    expect(screen.getByText('Some Notification Message')).toBeInTheDocument();
    const linkNode = document.querySelector('[href="https://www.google.com/"]');

    expect(linkNode).toBeInTheDocument();
    await userEvent.click(linkNode);
    expect(screen.getByText('somelinktext')).toBeInTheDocument();
    expect(screen.queryByText('View instructions')).not.toBeInTheDocument();
  });
});

