
import React, { useCallback } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import useConfirmDialog, { ConfirmDialogProvider } from '.';
import { renderWithProviders } from '../../test/test-utils';

function Test() {
  const { confirmDialog } = useConfirmDialog();
  const onClickBuyButton = useCallback(event => {
    if (event) {
      event.stopPropagation();
    }
    confirmDialog({
      isPrompt: true,
      title: 'Request to buy subscription',
      message: 'We will contact you to buy your subscription.',
      buttons: [
        {
          label: 'Submit request',
          onClick: () => {
          },
        },
        {
          label: 'Cancel',
          onClick: () => {
          },
          variant: 'text',
        },
      ],
      hideClose: false,
      onDialogClose: () => { },
    });
  }, [confirmDialog]);

  return (
    <div>
      <button onClick={onClickBuyButton} type="button">
        Button Clicked
      </button>
    </div>
  );
}

function Test2() {
  const { saveDiscardDialog } = useConfirmDialog();

  const onClickBuyButton = useCallback(() => {
    saveDiscardDialog({
      title: 'You’ve got unsaved changes',
      message: 'Are you sure you want to leave this page and lose your unsaved changes?',
      buttons: [
        { label: 'Save changes', onClick: () => {} },
        { label: 'Discard changes', variant: 'outlined', onClick: () => {} },
      ],
    });
  }, [saveDiscardDialog]);

  return (
    <div>
      <button onClick={onClickBuyButton} type="button">
        Button Clicked
      </button>
    </div>
  );
}

function Test3() {
  const { defaultConfirmDialog } = useConfirmDialog();
  const onClickBuyButton = useCallback(() => {
    defaultConfirmDialog({
      title: 'Confirm',
      message: 'Are you sure you want to save the changes',
      buttons: [
        { label: 'Yes', onClick: () => {} },
        { label: 'Cancel', variant: 'text' },
      ],
    });
  }, [defaultConfirmDialog]);

  return (
    <div>
      <button onClick={onClickBuyButton} type="button">
        Button Clicked
      </button>
    </div>
  );
}

function Test4() {
  const setConfirmDialogProps = () => {};
  const click = useCallback(() => setConfirmDialogProps(null), []);

  return (
    <div>
      <button onClick={click} type="button">
        Button Clicked
      </button>
    </div>
  );
}

function Test5() {
  const { confirmDialog } = useConfirmDialog();
  const onClickBuyButton = useCallback(event => {
    if (event) {
      event.stopPropagation();
    }
    confirmDialog({
      isHtml: true,
      isPrompt: true,
      onClose: () => {},
      message: 'We will contact you to buy your subscription.',
      hideClose: false,
      onDialogClose: () => {},
    });
  }, [confirmDialog]);
    //   const onClick = useCallback(() => {
    //     if (typeof onDialogClose === 'function') {
    //       onDialogClose();
    //     }
    //     // Default close fn which closes the dialog
    //     onClose();
    //   }, [onClose, onDialogClose]);

  return (
    <div>
      <button onClick={onClickBuyButton} type="button"> Button Clicked </button>
    </div>
  );
}

const mockReact = React;

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/material/IconButton'),
  default: props => {
    const mockProps = {...props};

    delete mockProps.autoFocus;

    return mockReact.createElement('IconButton', mockProps, mockProps.children);
  },
}));

describe('confirm Dialogue Component Testing', () => {
  test('testing what is rendered in the DOM', async () => {
    renderWithProviders(
      <MemoryRouter>
        <ConfirmDialogProvider>
          <Test />
        </ConfirmDialogProvider>
      </MemoryRouter>
    );
    const value = screen.getByText('Button Clicked');

    expect(value).toBeInTheDocument();
    await fireEvent.click(value);
    const svg = document.querySelector("[viewBox='0 0 24 24']");

    expect(svg).toBeInTheDocument();
    const value1 = screen.getByText('Cancel');

    expect(value1).toBeInTheDocument();
    await userEvent.click(value1);
  });

  test('testing dialogue box without userevents', async () => {
    renderWithProviders(
      <MemoryRouter>
        <ConfirmDialogProvider>
          <Test />
        </ConfirmDialogProvider>
      </MemoryRouter>
    );
    const value = screen.getByText('Button Clicked');

    expect(value).toBeInTheDocument();
    await userEvent.click(value);
    const value1 = screen.getByRole('textbox');

    expect(value1).toBeInTheDocument();
    await userEvent.type(value1, 'Hello, World!');
  });

  test('testing saveDiscardDialogue', async () => {
    renderWithProviders(
      <MemoryRouter>
        <ConfirmDialogProvider>
          <Test2 />
        </ConfirmDialogProvider>
      </MemoryRouter>
    );
    const value = screen.getByText('Button Clicked');

    expect(value).toBeInTheDocument();
    await fireEvent.click(value);
    const value1 = screen.getByText('You’ve got unsaved changes');

    expect(value1).toBeInTheDocument();

    const svg = document.querySelector("[viewBox='0 0 24 24']");

    expect(svg).toBeInTheDocument();

    const value2 = screen.getByText('Are you sure you want to leave this page and lose your unsaved changes?');

    expect(value2).toBeInTheDocument();

    const value3 = screen.getByText('Save changes');

    expect(value3).toBeInTheDocument();

    const value4 = screen.getByText('Discard changes');

    expect(value4).toBeInTheDocument();
    await fireEvent.click(value3);
    expect(value3).not.toBeInTheDocument();
  });

  test('testing defaultConfirmDialog', async () => {
    renderWithProviders(
      <MemoryRouter>
        <ConfirmDialogProvider>
          <Test3 />
        </ConfirmDialogProvider>
      </MemoryRouter>
    );
    const value = screen.getByText('Button Clicked');

    expect(value).toBeInTheDocument();
    await fireEvent.click(value);
    const value2 = screen.getByText('Confirm');

    expect(value2).toBeInTheDocument();
    const value3 = screen.getByText('Yes');

    expect(value3).toBeInTheDocument();
    const value4 = screen.getByText('Cancel');

    expect(value4).toBeInTheDocument();
    await fireEvent.click(value3);
    expect(value3).not.toBeInTheDocument();
  });

  test('testing onClose', async () => {
    renderWithProviders(
      <MemoryRouter>
        <ConfirmDialogProvider>
          <Test4 />
        </ConfirmDialogProvider>
      </MemoryRouter>
    );
    const value1 = screen.getByText('Button Clicked');

    expect(value1).toBeInTheDocument();
    await fireEvent.click(value1);
  });

  test('testing Confirm Dialogue with isHtml true', async () => {
    renderWithProviders(
      <MemoryRouter>
        <ConfirmDialogProvider>
          <Test5 />
        </ConfirmDialogProvider>
      </MemoryRouter>
    );
    const value = screen.getByText('Button Clicked');

    expect(value).toBeInTheDocument();
    await fireEvent.click(value);
    const value1 = screen.getByText('No');

    expect(value1).toBeInTheDocument();
    // fireEvent.click(value1);
    const value2 = screen.getAllByRole('button');

    expect(value2[0]).toBeInTheDocument();
    await userEvent.click(value2[0]);
  });
});

