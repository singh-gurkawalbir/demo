import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalDialog from '.';
import { renderWithProviders } from '../../test/test-utils';

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

describe('modalDialog UI tests', () => {
  test('should not show the modal dialog when the prop "show" is false', () => {
    const {utils} = renderWithProviders(
      <ModalDialog show={false}>
        <div>child-1</div>
        <div>child-2</div>
        <div>child-3</div>
      </ModalDialog>);

    expect(utils.container).toBeEmptyDOMElement();
  });

  test('should show the modal when the prop "show" is true', () => {
    renderWithProviders(
      <ModalDialog show>
        <div>child-1</div>
        <div>child-2</div>
        <div>child-3</div>
      </ModalDialog>);
    expect(screen.getByText('child-1')).toBeInTheDocument();
    expect(screen.getByText('child-2')).toBeInTheDocument();
    expect(screen.getByText('child-3')).toBeInTheDocument();
  });

  test('should click the close button', async () => {
    const onclose = jest.fn();

    await renderWithProviders(
      <ModalDialog show onClose={onclose}>
        <div>child-1</div>
        <div>child-2</div>
        <div>child-3</div>
      </ModalDialog>);
    expect(screen.getByText('child-1')).toBeInTheDocument();
    expect(screen.getByText('child-2')).toBeInTheDocument();
    expect(screen.getByText('child-3')).toBeInTheDocument();

    waitFor(async () => {
      const button = screen.getByRole('button');

      await userEvent.click(button);
      expect(onclose).toHaveBeenCalledTimes(1);
    });
  });

  test('should disable the close button', () => {
    const onclose = jest.fn();

    renderWithProviders(
      <ModalDialog show onClose={onclose} disableClose>
        <div>child-1</div>
        <div>child-2</div>
        <div>child-3</div>
      </ModalDialog>);
    expect(screen.getByText('child-1')).toBeInTheDocument();
    expect(screen.getByText('child-2')).toBeInTheDocument();
    expect(screen.getByText('child-3')).toBeInTheDocument();

    waitFor(() => {
      const button = screen.getByRole('button');

      expect(button).toBeDisabled();
    });
  });

  test('should click on the action handler function provided through prop', async () => {
    const actionhanlder = jest.fn();

    renderWithProviders(
      <ModalDialog show actionHandler={actionhanlder} actionLabel="actionLabel">
        <div>child-1</div>
        <div>child-2</div>
        <div>child-3</div>
      </ModalDialog>);
    expect(screen.getByText('child-1')).toBeInTheDocument();
    expect(screen.getByText('child-2')).toBeInTheDocument();
    expect(screen.getByText('child-3')).toBeInTheDocument();

    waitFor(async () => {
      const actionbutton = screen.getByText('actionLabel');

      await userEvent.click(actionbutton);
      expect(actionhanlder).toHaveBeenCalledTimes(2);
    });
  });
});
