/* global describe, test, expect ,jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalDialog from '.';

describe('ModalDialog UI tests', () => {
  test('should not show the modal dialog when the prop "show" is false', () => {
    const {container} = render(
      <ModalDialog show={false}>
        <div>child-1</div>
        <div>child-2</div>
        <div>child-3</div>
      </ModalDialog>);

    expect(container).toBeEmptyDOMElement();
  });

  test('should show the modal when the prop "show" is true', () => {
    render(
      <ModalDialog show>
        <div>child-1</div>
        <div>child-2</div>
        <div>child-3</div>
      </ModalDialog>);
    expect(screen.getByText('child-1')).toBeInTheDocument();
    expect(screen.getByText('child-2')).toBeInTheDocument();
    expect(screen.getByText('child-3')).toBeInTheDocument();
  });

  test('should click the close button', () => {
    const onclose = jest.fn();

    render(
      <ModalDialog show onClose={onclose}>
        <div>child-1</div>
        <div>child-2</div>
        <div>child-3</div>
      </ModalDialog>);
    expect(screen.getByText('child-1')).toBeInTheDocument();
    expect(screen.getByText('child-2')).toBeInTheDocument();
    expect(screen.getByText('child-3')).toBeInTheDocument();

    const button = screen.getByRole('button');

    userEvent.click(button);

    expect(onclose).toHaveBeenCalled();
  });

  test('should disable the close button', () => {
    const onclose = jest.fn();

    render(
      <ModalDialog show onClose={onclose} disableClose>
        <div>child-1</div>
        <div>child-2</div>
        <div>child-3</div>
      </ModalDialog>);
    expect(screen.getByText('child-1')).toBeInTheDocument();
    expect(screen.getByText('child-2')).toBeInTheDocument();
    expect(screen.getByText('child-3')).toBeInTheDocument();

    const button = screen.getByRole('button');

    expect(button).toBeDisabled();
  });

  test('should click on the action handler function provided through prop', () => {
    const actionhanlder = jest.fn();

    render(
      <ModalDialog show actionHandler={actionhanlder} actionLabel="actionLabel">
        <div>child-1</div>
        <div>child-2</div>
        <div>child-3</div>
      </ModalDialog>);
    expect(screen.getByText('child-1')).toBeInTheDocument();
    expect(screen.getByText('child-2')).toBeInTheDocument();
    expect(screen.getByText('child-3')).toBeInTheDocument();

    const actionbutton = screen.getByText('actionLabel');

    userEvent.click(actionbutton);
    expect(actionhanlder).toHaveBeenCalledTimes(1);
  });
});
