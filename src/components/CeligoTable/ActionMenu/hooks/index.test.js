
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useGetAllActionProps } from '.';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders } from '../../../../test/test-utils';

async function inituseGetAllActionProps(
  {
    meta = {},
    rowData,
    handleMenuClose = jest.fn(),
    setSelectedComponent = jest.fn(),
  } = {}) {
  let returnData;
  const DummyComponent = () => {
    returnData = useGetAllActionProps({
      meta,
      rowData,
      handleMenuClose,
      setSelectedComponent,
    });

    return (
      <>
        <button type="button" onClick={returnData.handleActionClick}>
          Test Button
        </button>
        <div>
          {returnData.actionIcon}
        </div>
      </>
    );
  };

  const { utils, store } = renderWithProviders(<DummyComponent />);

  return {
    returnData,
    utils,
    store,
  };
}

describe('useGetAllActionProps component Test cases', () => {
  runServer();
  test('should pass the intial render with no data', async () => {
    const { returnData } = await inituseGetAllActionProps();

    expect(returnData.actionIcon).toBeNull();
    expect(returnData.hasAccess).toBeTruthy();
    expect(returnData.label).toBe('');
    expect(returnData.disabledActionTitle).toBe('');
  });

  test('should pass the intial render handleActionClick with OnClick', async () => {
    const TestComponent = () => (<div>Test Div</div>);
    const mockOnClick = jest.fn();
    const useOnClick = jest.fn(() => mockOnClick);

    await inituseGetAllActionProps({
      meta: {
        key: '1',
        icon: TestComponent,
        label: 'label_1',
        useOnClick,
        useHasAccess: jest.fn(() => jest.fn()),
        useDisabledActionText: jest.fn(() => jest.fn()),
        useLabel: jest.fn(() => jest.fn()),
      },
    });

    expect(screen.queryByText('Test Div')).toBeInTheDocument();
    const testButton = screen.getByRole('button', {name: 'Test Button'});

    expect(testButton).toBeInTheDocument();
    await userEvent.click(testButton);
    await expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('should pass the intial render handleActionClick with Component', async () => {
    const TestComponent = () => (<div>Test Div</div>);
    const Component = () => (<div>Test Component</div>);
    const setSelectedComponent = jest.fn();

    await inituseGetAllActionProps({
      meta: {
        key: '1',
        icon: TestComponent,
        label: 'label_1',
        Component,
      },
      setSelectedComponent,
    });

    expect(screen.queryByText('Test Div')).toBeInTheDocument();
    const testButton = screen.getByRole('button', {name: 'Test Button'});

    expect(testButton).toBeInTheDocument();
    await userEvent.click(testButton);
    await expect(setSelectedComponent).toHaveBeenCalledTimes(1);
  });
});
