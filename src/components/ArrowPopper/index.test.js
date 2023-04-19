import React, { useState } from 'react';
import {
  screen,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ArrowPopper from '.';
import { runServer } from '../../test/api/server';
import { renderWithProviders} from '../../test/test-utils';

async function initActionButton({placement = 'bottom-end', children = '', props = {}} = {}) {
  const ButtonChild = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const handleClick = event => {
      setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    const handleClose = () => {
      setAnchorEl(null);
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    return (
      <>
        <div>
          Test Clickaway
        </div>
        <button aria-owns={id} type="button" aria-haspopup="true" onClick={handleClick}>
          Toggle Popper
        </button>
        <ArrowPopper
          id={id}
          open={open}
          anchorEl={anchorEl}
          placement={placement}
          onClose={handleClose}
          offsetPopper="0,6"
          {...props}
        >
          {children}
        </ArrowPopper>
      </>
    );
  };

  const ui = (
    <MemoryRouter>
      <ButtonChild />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

describe('arrowPopper component Test cases', () => {
  runServer();
  let renenderFun;
  let clickAway;

  beforeEach(async () => {
    renenderFun = async props => {
      await initActionButton(props);
      const buttonRef = screen.getByRole('button', {name: 'Toggle Popper'});

      expect(buttonRef).toBeInTheDocument();
      await userEvent.click(buttonRef);
    };

    clickAway = async textToBeTested => {
      const divRef = screen.queryByText('Test Clickaway');

      await userEvent.click(divRef);
      await waitFor(() => expect(screen.queryByText(textToBeTested)).not.toBeInTheDocument());
    };
  });

  test('should pass the the onclick and click away', async () => {
    renenderFun({children: 'Test Popper',
      placement: 'top',
      props: {
        className: 'test_classname',
        preventOverflow: false,
        restrictToParent: false,
      }});

    await waitFor(() => expect(screen.queryByText('Test Popper')).toBeInTheDocument());
    const testPopper = screen.queryByText('Test Popper');

    await userEvent.click(testPopper);
    await waitFor(() => expect(screen.queryByText('Test Popper')).toBeInTheDocument());

    clickAway('Test Popper');
  });

  test('should pass the the onclick and click away with child element', async () => {
    renenderFun({children: <div>Testy div</div>,
      props: {
        classes: {
          arrow: {
            left: '110px !important',
          },
        },
      }});

    await waitFor(() => expect(screen.queryByText('Testy div')).toBeInTheDocument());
    const testPopper = screen.queryByText('Testy div');

    await userEvent.click(testPopper);
    await waitFor(() => expect(screen.queryByText('Testy div')).toBeInTheDocument());

    clickAway('Testy div');
  });

  test('should pass the the onclick and click away with list element', async () => {
    renenderFun({
      children: (
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
        </ul>),
    });
    await waitFor(() => expect(screen.queryByText('Item 1')).toBeInTheDocument());
    await waitFor(() => expect(screen.queryByText('Item 2')).toBeInTheDocument());
    const item1 = screen.queryByText('Item 1');
    const item2 = screen.queryByText('Item 2');

    await userEvent.click(item1);
    await waitFor(() => expect(screen.queryByText('Item 1')).toBeInTheDocument());
    await userEvent.click(item2);
    await waitFor(() => expect(screen.queryByText('Item 2')).toBeInTheDocument());

    clickAway('Item 1');
  });
});
