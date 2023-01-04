
import React from 'react';
import { useFunctionsFromHookProps } from './useFunctionsFromHookProps';
import { runServer } from '../../../../test/api/server';
import { renderWithProviders } from '../../../../test/test-utils';

async function inituseFunctionsFromHookProps({ meta = {}, rowData = {} } = {}) {
  let returnData;
  const DummyComponent = () => {
    returnData = useFunctionsFromHookProps(meta, rowData);

    return (
      <>
        <div>
          test Div
        </div>
      </>
    );
  };

  const { utils, store } = await renderWithProviders(<DummyComponent />);

  return {
    returnData,
    utils,
    store,
  };
}

describe('useFunctionsFromHookProps component Test cases', () => {
  runServer();

  test('should pass the intial render with default values', async () => {
    const { returnData } = await inituseFunctionsFromHookProps({});

    expect(returnData.onClick).toBeNull();
    expect(returnData.hasAccess).toBeTruthy();
    expect(returnData.disabledActionText).toBe('');
    expect(returnData.label).toBe('');
  });

  test('should pass the intial render with Custom values', async () => {
    const useOnClick = jest.fn().mockReturnValue('useOnClick');
    const useHasAccess = jest.fn().mockReturnValue('useHasAccess');
    const useDisabledActionText = jest.fn().mockReturnValue('useDisabledActionText');
    const useLabel = jest.fn().mockReturnValue('useLabel');
    const { returnData } = await inituseFunctionsFromHookProps({
      meta: {
        useOnClick,
        useHasAccess,
        useDisabledActionText,
        useLabel,
      },
    });

    expect(returnData.onClick).toBe('useOnClick');
    expect(returnData.hasAccess).toBe('useHasAccess');
    expect(returnData.disabledActionText).toBe('useDisabledActionText');
    expect(returnData.label).toBe('useLabel');
  });
});
