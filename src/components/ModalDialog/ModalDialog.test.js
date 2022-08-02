/* global describe, test, expect ,jest */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ModalDialog from '.';

describe('ModalDialog testing', () => {
  test('should test when show is false', () => {
    const {container} = render(
      <ModalDialog show={false}>
        <div>child-1</div>
        <div>child-2</div>
        <div>child-3</div>
      </ModalDialog>);

    expect(container).toBeEmptyDOMElement();
  });

  test('should test when show porp is true', () => {
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

  test('onclose button testing', () => {
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

  test('onclose button disable', () => {
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

  test('actionhanlder testing', () => {
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
