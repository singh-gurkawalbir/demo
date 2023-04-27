import React from 'react';
import {
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Link } from 'react-router-dom';
import { AppShell } from '@celigo/fuse-ui';
import ActionButton from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders} from '../../test/test-utils';

async function initActionButton({ children = '', placement = 'bottom', props = {}, tooltip = ''} = {}) {
  const ui = (
    <MemoryRouter>
      <ActionButton
        placement={placement}
        tooltip={tooltip}
        {...props}
        >
        {children}
      </ActionButton>
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('actionButton component Test cases', () => {
  runServer();
  test('should pass the intial render', async () => {
    await initActionButton({placement: 'top'});
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  test('should pass the intial render by setting some children and class name', async () => {
    await initActionButton({children: 'Test Button',
      props: {
        className: 'test-classname',
      }});
    const buttonRef = screen.getByRole('button', {name: 'Test Button'});

    expect(buttonRef).toBeInTheDocument();
  });

  test('should pass the intial render by setting children and title', async () => {
    await initActionButton({children: 'Test Button', tooltip: 'button title for you'});
    const buttonRef = screen.getByText('Test Button');

    expect(buttonRef).toBeInTheDocument();
    expect(screen.queryByText('button title for you')).not.toBeInTheDocument();

    userEvent.hover(buttonRef);

    await waitFor(() => {
      const tooltipRef = screen.getByRole('tooltip', {name: 'button title for you'});

      expect(tooltipRef).toBeInTheDocument();
    });
  });

  test('should pass the intial render by setting children and onClick', async () => {
    const mockOnClick = jest.fn();

    await initActionButton({children: 'Test Button', props: {onClick: mockOnClick}});
    const buttonRef = screen.getByRole('button', {name: 'Test Button'});

    expect(buttonRef).toBeInTheDocument();
    await userEvent.click(buttonRef);

    await waitFor(() => {
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  test('should pass the intial render by setting children and disabled true/false', async () => {
    const {utils} = await initActionButton({children: 'Test Button', props: {disabled: true}});
    const buttonRef = screen.getByRole('button', {name: 'Test Button'});

    expect(buttonRef).toBeDisabled();
    utils.rerender(<AppShell><ActionButton disabled={false}>Test Button</ActionButton></AppShell>);
    const buttonRef1 = screen.getByRole('button', {name: 'Test Button'});

    expect(buttonRef1).not.toBeDisabled();
  });

  test('should pass the intial render by setting children and Link element', async () => {
    await initActionButton({children: 'Test Button',
      props: {
        component: Link,
        to: '/test/to',
      }});
    const buttonRef = screen.getByRole('button', {name: 'Test Button'});

    expect(buttonRef).toHaveAttribute('href', '/test/to');
  });
});
