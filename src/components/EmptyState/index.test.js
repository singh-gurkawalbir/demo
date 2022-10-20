/* global describe, test, expect, jest */
import React from 'react';
import {
  screen,
} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EmptyState from '.';
import { renderWithProviders} from '../../test/test-utils';

async function initEmptyState({ children = '', type = '', title = '', subTitle = ''} = {}) {
  const ui = (
    <MemoryRouter>
      <EmptyState
        type={type}
        title={title}
        subTitle={subTitle}
        >
        {children}
      </EmptyState>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

jest.mock('../../utils/image', () => ({
  __esModule: true,
  ...jest.requireActual('../../utils/image'),
  default: jest.fn().mockReturnValue('somethingURL'),
}));

describe('EmptyState component Test cases', () => {
  test('should pass the intial render', async () => {
    await initEmptyState();
    expect(screen.getByRole('img')).toBeInTheDocument();
    screen.debug(null, Infinity);
  });

  test('should pass the intial render by setting title, subTitle, type and children', async () => {
    await initEmptyState({
      title: 'Test Title',
      subTitle: 'Test Subtitle',
      type: 'recyclebin',
      children: <div>test children</div>,
    });
    expect(screen.getByText(/Test Title/i)).toBeInTheDocument();
    screen.debug(null, Infinity);
  });

  test('should have the image source as somethingURL', async () => {
    await initEmptyState({
      type: 'recyclebin',
    });
    expect(screen.getByRole('img')).toHaveAttribute('src', 'somethingURL');
    screen.debug(null, Infinity);
  });
});
