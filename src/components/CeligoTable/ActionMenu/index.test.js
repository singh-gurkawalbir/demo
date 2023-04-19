import React from 'react';
import {
  screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ActionMenu from '.';
import { runServer } from '../../../test/api/server';
import { renderWithProviders } from '../../../test/test-utils';

async function initActionMenu({
  useRowActions = jest.fn().mockReturnValue([{key: '1', actionIcon: 'icon_1', label: 'label_1'}, {key: 2, actionIcon: 'icon_2', label: 'label_2'}]),
  rowData,
  setSelectedComponent = jest.fn(),
  iconLabel,
  tooltip,
} = {}) {
  const ui = (
    <MemoryRouter>
      <ActionMenu
        useRowActions={useRowActions}
        rowData={rowData}
        setSelectedComponent={setSelectedComponent}
        iconLabel={iconLabel}
        tooltip={tooltip}
       />
    </MemoryRouter>
  );

  return renderWithProviders(ui);
}

jest.mock('../../Buttons/TextButton', () => ({
  __esModule: true,
  ...jest.requireActual('../../Buttons/TextButton'),
  default: props => (
    <>
      <button type="button" onClick={props.onClick} data-testid="text_button">
        {props.children}
      </button>
    </>
  ),
}));

jest.mock('../../ArrowPopper', () => ({
  __esModule: true,
  ...jest.requireActual('../../ArrowPopper'),
  default: props => (
    <>
      <div
        onClick={props.onClose}
        data-testid="arrow_popper"
        id={props.id}
        open={props.open}
        anchorel={props.anchorEl}
        >
        Test Child
      </div>
    </>
  ),
}));

describe('actionMenu component Test cases', () => {
  runServer();
  test('should pass the intial render with no actions', async () => {
    const useRowActions = jest.fn().mockReturnValue([]);
    const { utils } = await initActionMenu({
      useRowActions,
    });

    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should pass the intial render with actions', async () => {
    const { utils } = await initActionMenu();

    expect(utils.container).not.toBeEmptyDOMElement();
  });

  test('should pass the intial render with iconLabel', async () => {
    const setSelectedComponent = jest.fn();
    const iconLabel = 'Test Label';

    await initActionMenu({
      iconLabel,
      setSelectedComponent,
    });
    const iconButton = await screen.getByRole('button', {name: iconLabel});

    expect(iconButton).toBeInTheDocument();
    await userEvent.click(iconButton);
    await waitFor(() => expect(setSelectedComponent).toHaveBeenCalledTimes(1));
  });

  test('should pass the intial render without iconLabel', async () => {
    const setSelectedComponent = jest.fn();

    await initActionMenu({
      setSelectedComponent,
    });
    const iconButton = await screen.getByRole('button');

    expect(iconButton).toBeInTheDocument();
    await userEvent.click(iconButton);
    await waitFor(() => expect(setSelectedComponent).toHaveBeenCalledTimes(1));
  });

  test('should pass for handleMenuClose', async () => {
    await initActionMenu();
    const iconButtons = await screen.getAllByRole('button');

    const iconButton = iconButtons.find(eachButton => eachButton.hasAttribute('aria-label', 'more'));

    await waitFor(() => expect(iconButton).toBeInTheDocument());
    await userEvent.click(iconButton);

    const listButton = await waitFor(() => screen.getByRole('tooltip'));

    await userEvent.click(listButton);
    await waitFor(() => expect(listButton).toBeInTheDocument());
    await waitFor(() => expect(screen.getAllByRole('menuitem')).toHaveLength(2));

    await userEvent.click(listButton);
    await waitFor(() => expect(screen.queryAllByRole('menuitem')).toHaveLength(0));
  });

  test('should pass initial render with tooltip action icon', async () => {
    await initActionMenu({
      tooltip: 'mock tooltip tooltip',
    });
    const iconButton = screen.getAllByRole('button').find(eachButton => eachButton.hasAttribute('aria-label', 'more'));

    expect(iconButton).toBeInTheDocument();
    userEvent.hover(iconButton);
    await waitFor(() => expect(screen.queryByText('mock tooltip tooltip')).toBeInTheDocument());
  });
});
