
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SelectResource from './SelectResource';
import { renderWithProviders } from '../../test/test-utils';

const flowResources = [{_id: 's1', name: 'name'}, {_id: 's2'}, {_id: 's3'}, {_id: 's4'}, {_id: 's5'}, {_id: 's6'}, {_id: 's7'}, {_id: 's8'}, {_id: 's9'}];
const selectedResources = ['s1', 's2'];

describe('selectResource UI Tests', () => {
  test('should select one more flow through checkbox', async () => {
    const onSave = jest.fn();

    renderWithProviders(<SelectResource flowResources={flowResources} selectedResources={selectedResources} onSave={onSave} />);

    const button = screen.getByText('2 flows selected');

    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
    expect(checkboxes[3]).not.toBeChecked();
    expect(checkboxes[4]).not.toBeChecked();
    expect(checkboxes[5]).not.toBeChecked();
    expect(checkboxes[6]).not.toBeChecked();
    expect(checkboxes[7]).not.toBeChecked();

    await userEvent.click(checkboxes[3]);
    expect(checkboxes[3]).toBeChecked();
    const applyButton = screen.getByText('Apply');

    expect(applyButton).toBeInTheDocument();
    await userEvent.click(applyButton);

    expect(onSave).toHaveBeenCalledWith(['s1', 's2', 's4']);
    expect(button.textContent).toBe('3 flows selected');
  });

  test('should click on the checked flow twice', async () => {
    const onSave = jest.fn();

    renderWithProviders(<SelectResource flowResources={flowResources} selectedResources={selectedResources} onSave={onSave} />);

    const button = screen.getByText('2 flows selected');

    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
    expect(checkboxes[3]).not.toBeChecked();
    expect(checkboxes[4]).not.toBeChecked();
    expect(checkboxes[5]).not.toBeChecked();
    expect(checkboxes[6]).not.toBeChecked();
    expect(checkboxes[7]).not.toBeChecked();

    await userEvent.click(checkboxes[0]);
    expect(checkboxes[0]).not.toBeChecked();
    const applyButton = screen.getByText('Apply');

    expect(applyButton).toBeInTheDocument();
    await userEvent.click(applyButton);

    expect(onSave).toHaveBeenCalledWith(['s2']);
  });

  test('should click the cancel button after selecting', async () => {
    const onSave = jest.fn();

    renderWithProviders(<SelectResource flowResources={flowResources} selectedResources={selectedResources} onSave={onSave} />);

    const button = screen.getByText('2 flows selected');

    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    const checkboxes = screen.getAllByRole('checkbox');

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
    expect(checkboxes[3]).not.toBeChecked();
    expect(checkboxes[4]).not.toBeChecked();
    expect(checkboxes[5]).not.toBeChecked();
    expect(checkboxes[6]).not.toBeChecked();
    expect(checkboxes[7]).not.toBeChecked();

    await userEvent.click(checkboxes[3]);
    expect(checkboxes[3]).toBeChecked();
    const cancelButton = screen.getByText('Cancel');

    expect(cancelButton).toBeInTheDocument();
    await userEvent.click(cancelButton);
    expect(checkboxes[0]).not.toBeVisible();
    expect(button).toBeVisible();

    await userEvent.click(button);

    expect(checkboxes[0]).toBeChecked();
    expect(checkboxes[1]).toBeChecked();
    expect(checkboxes[2]).not.toBeChecked();
    expect(checkboxes[3]).toBeChecked();
    expect(checkboxes[4]).not.toBeChecked();
    expect(checkboxes[5]).not.toBeChecked();
    expect(checkboxes[6]).not.toBeChecked();
    expect(checkboxes[7]).not.toBeChecked();
  });
  test('should select one item in start', async () => {
    const onSave = jest.fn();

    renderWithProviders(<SelectResource flowResources={flowResources} selectedResources={['s1']} onSave={onSave} />);

    const button = screen.getByText('name');

    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    const checkboxes = screen.getAllByRole('checkbox');

    await userEvent.click(checkboxes[1]);

    const applyButton = screen.getByText('Apply');

    expect(applyButton).toBeInTheDocument();
    await userEvent.click(applyButton);

    expect(button.textContent).toBe('2 flows selected');
  });

  test('should select all 8 flows', async () => {
    const onSave = jest.fn();

    renderWithProviders(<SelectResource flowResources={flowResources} selectedResources={['s1']} onSave={onSave} />);

    const button = screen.getByText('name');

    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    const checkboxes = screen.getAllByRole('checkbox');

    await userEvent.click(checkboxes[1]);
    await userEvent.click(checkboxes[2]);
    await userEvent.click(checkboxes[3]);
    await userEvent.click(checkboxes[4]);
    await userEvent.click(checkboxes[5]);
    await userEvent.click(checkboxes[6]);
    await userEvent.click(checkboxes[7]);
    await userEvent.click(checkboxes[8]);

    expect(screen.getByText('8 flows selected')).toBeInTheDocument();
  });

  test('should test when no flow is selected', () => {
    const onSave = jest.fn();

    renderWithProviders(<SelectResource onSave={onSave} />);
    expect(screen.getByText('No flows selected')).toBeInTheDocument();
  });
});
