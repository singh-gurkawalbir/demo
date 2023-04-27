import React from 'react';
import {screen} from '@testing-library/react';
import RefreshHeaders from './index';
import { renderWithProviders } from '../../../../../../test/test-utils';

function refreshHeaders(props = {}) {
  const ui = (
    <RefreshHeaders {...props} />
  );

  return renderWithProviders(ui);
}
describe('RefreshHeaders UI test cases', () => {
  test('Should test the refresh button to update the headers', async () => {
    const handleRefreshClickHandlerfun = () => true;
    const data = {
      optionsMap: [{id: 'export', label: 'Export field value', options: undefined, readOnly: false, required: false, supportsRefresh: true, type: 'input'}, {id: 'import', label: 'Import field value', options: undefined, readOnly: false, required: false, supportsRefresh: true, type: 'input'}],

      isLoggable: true,
      handleRefreshClickHandler: handleRefreshClickHandlerfun,
    };

    refreshHeaders(data);
    const refreshIcons = document.querySelectorAll('svg');

    expect(refreshIcons).toHaveLength(2);
  });
  test('should test when data is not loaded', () => {
    const data = {
      optionsMap: [{id: 'export', label: 'Export field value', options: undefined, readOnly: false, required: false, supportsRefresh: true, type: 'input'}, {id: 'import', label: 'Import field value', options: undefined, readOnly: false, required: false, supportsRefresh: true, type: 'input'}],
      isLoggable: true,
      isLoading: {
        import: {
          exist: true,
        },
      },
    };

    refreshHeaders(data);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should show empty dom when hide headers is set to true', () => {
    const data = {
      hideHeaders: true,
    };

    const {utils} = renderWithProviders(<RefreshHeaders {...data} />);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('Should return null when the headers does not support refresh', () => {
    const data = {
      optionsMap: [{id: 'export', label: 'Export field value', options: undefined, readOnly: false, required: false, supportsRefresh: true, type: 'input'}, {id: 'import', label: 'Import field value', options: undefined, readOnly: false, required: false, supportsRefresh: true, type: 'input'}],

      isLoggable: true,
    };

    refreshHeaders(data);
    expect(screen.getByText('Export field value')).toBeInTheDocument();
    expect(screen.getByText('Import field value')).toBeInTheDocument();
  });
});
