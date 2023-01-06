
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../test/test-utils';
import DynaMarketplaceId from './DynaMarketplaceId';
import { getCreatedStore } from '../../../store';
import actions from '../../../actions';

const mockDispatchFn = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

describe('test suite for DynaMarketplaceId field', () => {
  afterEach(() => {
    mockDispatchFn.mockClear();
  });

  test('should not be able to modify if used by some other resource', () => {
    const props = {
      resourceId: 'new-2XIgkB4W4F',
      resourceType: 'connections',
      id: 'http.unencrypted.marketplaceId',
      type: 'marketplaceid',
      label: 'Marketplace ID',
      skipSort: true,
      helpKey: 'amazonmws.connection.http.unencrypted.marketplaceId',
      required: true,
      options: [
        {
          items: [
            {
              value: 'A2EUQ1WTGCTBG2',
              label: 'A2EUQ1WTGCTBG2 (CA)',
            },
            {
              value: 'A1AM78C64UM0Y8',
              label: 'A1AM78C64UM0Y8 (MX)',
            },
            {
              value: 'ATVPDKIKX0DER',
              label: 'ATVPDKIKX0DER (US)',
            },
          ],
        },
      ],
      name: '/http/unencrypted/marketplaceId',
      defaultValue: '',
      formKey: 'connections-new-2XIgkB4W4F',
      value: 'ATVPDKIKX0DER',
      visible: true,
      isValid: true,
    };
    const initialStore = getCreatedStore();

    initialStore.getState().session.resource.references = {
      exports: [{
        id: 'export-123',
        name: 'Export X',
      }],
    };
    renderWithProviders(<DynaMarketplaceId {...props} />, {initialStore});
    expect(document.querySelector('input')).toHaveValue(props.value);
    expect(screen.getByRole('button', {name: 'ATVPDKIKX0DER (US)'})).toHaveAttribute('aria-disabled', 'true');
  });

  test('should have access to references while rendering the field', () => {
    const props = {
      resourceId: 'new-2XIgkB4W4F',
      resourceType: 'connections',
      id: 'http.unencrypted.marketplaceId',
      type: 'marketplaceid',
      label: 'Marketplace ID',
      skipSort: true,
      helpKey: 'amazonmws.connection.http.unencrypted.marketplaceId',
      required: true,
      options: [
        {
          items: [
            {
              value: 'A2EUQ1WTGCTBG2',
              label: 'A2EUQ1WTGCTBG2 (CA)',
            },
            {
              value: 'A1AM78C64UM0Y8',
              label: 'A1AM78C64UM0Y8 (MX)',
            },
            {
              value: 'ATVPDKIKX0DER',
              label: 'ATVPDKIKX0DER (US)',
            },
          ],
        },
      ],
      name: '/http/unencrypted/marketplaceId',
      defaultValue: '',
      formKey: 'connections-new-2XIgkB4W4F',
      value: 'ATVPDKIKX0DER',
      visible: true,
      isValid: true,
    };

    const {utils: {unmount}} = renderWithProviders(<DynaMarketplaceId {...props} />);

    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.requestReferences(props.resourceType, props.resourceId, {
      ignoreError: true,
    }));

    unmount();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.clearReferences());
  });
});
