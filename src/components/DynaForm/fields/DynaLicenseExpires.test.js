import React from 'react';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';
import DynaLicenseExpires from './DynaLicenseExpires';

const mockLocation = { pathname: '' };

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useLocation: () => mockLocation,
}));

describe('test suite for DynaLicenseExpires field', () => {
  test('should not show the option to add expiry date if incorrect url', () => {
    mockLocation.pathname = '/connectors/connector-123/add/connectorLicenses/connLic';
    const props = {
      resourceId: '638fa0e0c761cb61fd48952b',
      resourceType: 'connectorLicenses',
      defaultValue: '01/06/2023',
      type: 'licenseexpires',
      label: 'Expires',
      connectorId: 'connector-123',
      fieldId: 'expires',
      id: 'expires',
      name: '/expires',
      formKey: 'connectorLicenses-638fa0e0c761cb61fd48952b',
    };

    renderWithProviders(<DynaLicenseExpires {...props} />);
    expect(document.querySelector('body > div')).toBeEmptyDOMElement();
  });

  test('should not show the option to add trial expiry date when trial is disabled', () => {
    mockLocation.pathname = '/connectors/connector-123/connectorLicenses/edit/connectorLicenses/connLicense';
    const props = {
      resourceId: '6328a9050dbc53086e892ffe',
      resourceType: 'connectorLicenses',
      type: 'licenseexpires',
      label: 'Trial expires',
      connectorId: 'connector-123',
      fieldId: 'trialEndDate',
      id: 'trialEndDate',
      name: '/trialEndDate',
      formKey: 'connectorLicenses-6328a9050dbc53086e892ffe',
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.connectors = [{
        _id: props.connectorId,
        trialEnabled: false,
      }];
    });
    const { utils: { container } } = renderWithProviders(<DynaLicenseExpires {...props} />, { initialStore });

    expect(container).toBeEmptyDOMElement();
  });

  test('should not show the option to add trial expiry date when creating license for new connector', () => {
    const props = {
      resourceId: 'new-So0hJ',
      resourceType: 'connectorLicenses',
      type: 'licenseexpires',
      label: 'Trial expires',
      connectorId: 'connector-123',
      fieldId: 'trialEndDate',
      id: 'trialEndDate',
      name: '/trialEndDate',
      formKey: 'connectorLicenses-new-So0hJ',
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.data.resources.connectors = [{
        _id: props.connectorId,
        trialEnabled: true,
      }];
    });

    const { utils: { container } } = renderWithProviders(<DynaLicenseExpires {...props} />, { initialStore });

    expect(container).toBeEmptyDOMElement();
  });

  test('should be required to set the expiry date when trial is disabled', () => {
    const props = {
      resourceId: '638fa0e0c761cb61fd48952b',
      resourceType: 'connectorLicenses',
      defaultValue: '01/06/2023',
      type: 'licenseexpires',
      label: 'Expires',
      connectorId: 'connector-123',
      fieldId: 'expires',
      id: 'expires',
      name: '/expires',
      formKey: 'connectorLicenses-638fa0e0c761cb61fd48952b',
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.user.preferences.dateFormat = 'MM/DD/YYYY';
    });

    renderWithProviders(<DynaLicenseExpires {...props} />, { initialStore });
    expect(document.querySelector('label')).toHaveTextContent(`${props.label} *`);
  });

  test('should be required to set the expiry date in case of new connector', () => {
    const props = {
      resourceId: 'new-SoHGj',
      resourceType: 'connectorLicenses',
      defaultValue: '01/06/2023',
      type: 'licenseexpires',
      label: 'Expires',
      connectorId: 'connector-123',
      fieldId: 'expires',
      id: 'expires',
      name: '/expires',
      formKey: 'connectorLicenses-new-SoHGj',
    };
    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.user.preferences.dateFormat = 'MM/DD/YYYY';
      draft.data.resources.connectors = [{
        _id: props.connectorId,
        trialEnabled: true,
      }];
    });

    renderWithProviders(<DynaLicenseExpires {...props} />, { initialStore });
    expect(document.querySelector('label')).toHaveTextContent(`${props.label} *`);
  });
});
