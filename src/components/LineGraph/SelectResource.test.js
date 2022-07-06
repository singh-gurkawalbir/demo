/* global describe, test, expect ,jest */
import React from 'react';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectResource from './SelectResource';

const flowResources = [{_id: 's1', name: 'name'}, {_id: 's2'}, {_id: 's3'}, {_id: 's4'}, {_id: 's5'}, {_id: 's6'}, {_id: 's7'}, {_id: 's8'}, {_id: 's9'}];
const selectedResources = ['s1', 's2'];

describe('SelectResource UI Tests', () => {
  test('should select one more flow through checkbox', () => {
    const onSave = jest.fn();

    render(<SelectResource flowResources={flowResources} selectedResources={selectedResources} onSave={onSave} />);

    const button = screen.getByText('2 flows selected');

    expect(button).toBeInTheDocument();
    userEvent.click(button);
    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
    expect(checkboxes[3]).not.toBeChecked();
    expect(checkboxes[4]).not.toBeChecked();
    expect(checkboxes[5]).not.toBeChecked();
    expect(checkboxes[6]).not.toBeChecked();
    expect(checkboxes[7]).not.toBeChecked();

    userEvent.click(checkboxes[3]);
    expect(checkboxes[3]).toBeChecked();
    const alppyButton = screen.getByText('Apply');

    expect(alppyButton).toBeInTheDocument();
    userEvent.click(alppyButton);

    expect(onSave).toHaveBeenCalledWith(['s1', 's2', 's4']);
    expect(button.textContent).toBe('3 flows selected');

    screen.debug(undefined, 300000);
  });

  test('clicking on the checked flow twice', () => {
    const onSave = jest.fn();

    render(<SelectResource flowResources={flowResources} selectedResources={selectedResources} onSave={onSave} />);

    const button = screen.getByText('2 flows selected');

    expect(button).toBeInTheDocument();
    userEvent.click(button);
    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
    expect(checkboxes[3]).not.toBeChecked();
    expect(checkboxes[4]).not.toBeChecked();
    expect(checkboxes[5]).not.toBeChecked();
    expect(checkboxes[6]).not.toBeChecked();
    expect(checkboxes[7]).not.toBeChecked();

    userEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
    const alppyButton = screen.getByText('Apply');

    expect(alppyButton).toBeInTheDocument();
    userEvent.click(alppyButton);

    expect(onSave).toHaveBeenCalledWith(['s2']);

    screen.debug(undefined, 300000);
  });

  test('clicking the cancel button after selceting', () => {
    const onSave = jest.fn();

    render(<SelectResource flowResources={flowResources} selectedResources={selectedResources} onSave={onSave} />);

    const button = screen.getByText('2 flows selected');

    expect(button).toBeInTheDocument();
    userEvent.click(button);
    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
    expect(checkboxes[3]).not.toBeChecked();
    expect(checkboxes[4]).not.toBeChecked();
    expect(checkboxes[5]).not.toBeChecked();
    expect(checkboxes[6]).not.toBeChecked();
    expect(checkboxes[7]).not.toBeChecked();

    userEvent.click(checkboxes[3]);
    expect(checkboxes[3]).toBeChecked();
    const cancelButton = screen.getByText('Cancel');

    expect(cancelButton).toBeInTheDocument();
    userEvent.click(cancelButton);
    expect(checkboxes[0]).not.toBeVisible();
    expect(button).toBeVisible();

    userEvent.click(button);

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
    expect(checkboxes[3]).toBeChecked();
    expect(checkboxes[4]).not.toBeChecked();
    expect(checkboxes[5]).not.toBeChecked();
    expect(checkboxes[6]).not.toBeChecked();
    expect(checkboxes[7]).not.toBeChecked();
  });
  test('just one selected item in start', () => {
    const onSave = jest.fn();

    render(<SelectResource flowResources={flowResources} selectedResources={['s1']} onSave={onSave} />);

    const button = screen.getByText('name');

    expect(button).toBeInTheDocument();
    userEvent.click(button);
    const checkboxes = screen.getAllByRole('checkbox');

    userEvent.click(checkboxes[1]);

    const alppyButton = screen.getByText('Apply');

    expect(alppyButton).toBeInTheDocument();
    userEvent.click(alppyButton);

    expect(button.textContent).toBe('2 flows selected');

    screen.debug(undefined, 300000);
  });

  test('just one selected item in st', () => {
    const onSave = jest.fn();

    render(<SelectResource flowResources={flowResources} selectedResources={['s1']} onSave={onSave} />);

    const button = screen.getByText('name');

    expect(button).toBeInTheDocument();
    userEvent.click(button);
    const checkboxes = screen.getAllByRole('checkbox');

    userEvent.click(checkboxes[1]);
    userEvent.click(checkboxes[2]);
    userEvent.click(checkboxes[3]);
    userEvent.click(checkboxes[4]);
    userEvent.click(checkboxes[5]);
    userEvent.click(checkboxes[6]);
    userEvent.click(checkboxes[7]);
    userEvent.click(checkboxes[8]);

    const alppyButton = screen.getByText('Apply');

    expect(alppyButton).toBeInTheDocument();

    screen.debug(undefined, 300000);
  });

  test('nothing', () => {
    const onSave = jest.fn();

    render(<SelectResource onSave={onSave} />);

    screen.debug(undefined, 300000);
  });
});
