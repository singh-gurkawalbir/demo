
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import { getCreatedStore } from '../../../store';
import actions from '../../../actions';
import DynaNetsuiteAPIVersion from './DynaNetSuiteAPIVersion';

const mockDispatchFn = jest.fn();
const onFieldChange = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

describe('test suite for DynaNetsuiteAPIVersion field', () => {
  afterEach(() => {
    mockDispatchFn.mockClear();
    onFieldChange.mockClear();
  });

  test('should show spinner in case of new resource while metadata is being fetched', () => {
    const props = {
      resourceId: 'new-So3JJHSqd4',
      resourceType: 'exports',
      fieldId: 'netsuite.restlet.useSS2Restlets',
      type: 'netsuiteapiversion',
      label: 'NetSuite API version',
      onFieldChange,
      options: [
        {
          items: [
            {
              label: 'SuiteScript 1.0',
              value: 'false',
            },
            {
              label: 'SuiteScript 2.0',
              value: 'true',
            },
          ],
        },
      ],
      isNew: true,
      connectionId: 'connection-123',
      id: 'netsuite.restlet.useSS2Restlets',
      name: '/netsuite/restlet/useSS2Restlets',
      formKey: 'exports-new-So3JJHSqd4',
      value: 'false',
      visible: true,
      isValid: true,
    };

    const {utils: {unmount}} = renderWithProviders(<DynaNetsuiteAPIVersion {...props} />);

    expect(onFieldChange).toHaveBeenCalledWith(props.id, 'false');
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.metadata.getBundleInstallStatus(props.connectionId));
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    unmount();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resourceForm.hideBundleInstallNotification(props.resourceType, props.resourceId));
  });

  test('should populate the saved API version', () => {
    const props = {
      resourceId: 'new-So3JJHSqd4',
      resourceType: 'exports',
      fieldId: 'netsuite.restlet.useSS2Restlets',
      type: 'netsuiteapiversion',
      label: 'NetSuite API version',
      onFieldChange,
      options: [
        {
          items: [
            {
              label: 'SuiteScript 1.0',
              value: 'false',
            },
            {
              label: 'SuiteScript 2.0',
              value: 'true',
            },
          ],
        },
      ],
      isNew: true,
      connectionId: 'connection-123',
      id: 'netsuite.restlet.useSS2Restlets',
      name: '/netsuite/restlet/useSS2Restlets',
      formKey: 'exports-new-So3JJHSqd4',
      value: 'true',
      visible: true,
      isValid: true,
    };

    const initialStore = getCreatedStore();

    initialStore.getState().session.metadata.application[props.connectionId] = {
      [`connections/${props.connectionId}/distributedApps`]: {
        data: {
          bundle: {
            success: true,
          },
          suiteapp: {
            success: true,
          },
        },
        status: 'received',
      },
    };
    renderWithProviders(<DynaNetsuiteAPIVersion {...props} />, {initialStore});
    expect(onFieldChange).toHaveBeenCalledWith(props.id, 'false');
    const radioGroup = screen.getByRole('radiogroup', {name: props.label});
    const apiVersions = screen.getAllByRole('radio');

    expect(radioGroup).toBeInTheDocument();
    expect(apiVersions).toHaveLength(2);
    apiVersions.forEach(apiVersion => expect(radioGroup).toContainElement(apiVersion));
    const selectedVersion = apiVersions.find(apiVersion => apiVersion.value === props.value);

    expect(selectedVersion).toBeChecked();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.metadata.getBundleInstallStatus(props.connectionId));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resourceForm.hideBundleInstallNotification(props.resourceType, props.resourceId));
  });

  test('should show the error message if any', () => {
    const props = {
      resourceId: 'So3JJHSqd4',
      resourceType: 'exports',
      fieldId: 'netsuite.restlet.useSS2Restlets',
      type: 'netsuiteapiversion',
      label: 'NetSuite API version',
      onFieldChange,
      defaultDisabled: false,
      options: [
        {
          items: [
            {
              label: 'SuiteScript 1.0',
              value: 'false',
            },
            {
              label: 'SuiteScript 2.0',
              value: 'true',
            },
          ],
        },
      ],
      isValid: false,
      connectionId: 'connection-123',
      id: 'netsuite.restlet.useSS2Restlets',
      name: '/netsuite/restlet/useSS2Restlets',
      helpKey: 'export.netsuite.restlet.useSS2Restlets',
      formKey: 'exports-So3JJHSqd4',
      value: 'true',
      visible: true,
    };

    const initialStore = getCreatedStore();

    initialStore.getState().session.metadata.application[props.connectionId] = {
      [`connections/${props.connectionId}/distributedApps`]: {
        data: {
          suiteapp: { URL: 'https://sampleURL.com'},
        },
        errorMessage: 'Invalid URL',
        status: 'received',
      },
    };
    renderWithProviders(<DynaNetsuiteAPIVersion {...props} />, {initialStore});
    expect(onFieldChange).not.toHaveBeenCalled();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resourceForm.showBundleInstallNotification('2.0', 'https://sampleURL.com', props.resourceType, props.resourceId));
    expect(screen.getByText('Invalid URL')).toBeInTheDocument();
  });

  test('should be able to switch between the available versions', () => {
    const props = {
      resourceId: 'So3JJHSqd4',
      resourceType: 'exports',
      fieldId: 'netsuite.restlet.useSS2Restlets',
      type: 'netsuiteapiversion',
      label: 'NetSuite API version',
      onFieldChange,
      defaultDisabled: false,
      options: [
        {
          items: [
            {
              label: 'SuiteScript 1.0',
              value: 'false',
            },
            {
              label: 'SuiteScript 2.0',
              value: 'true',
            },
          ],
        },
      ],
      connectionId: 'connection-123',
      id: 'netsuite.restlet.useSS2Restlets',
      name: '/netsuite/restlet/useSS2Restlets',
      formKey: 'exports-So3JJHSqd4',
      value: 'true',
      visible: true,
      isValid: true,
    };

    const initialStore = getCreatedStore();

    initialStore.getState().session.metadata.application[props.connectionId] = {
      [`connections/${props.connectionId}/distributedApps`]: {
        data: {
          bundle: {
            success: true,
          },
          suiteapp: {
            success: true,
          },
        },
        status: 'received',
      },
    };
    renderWithProviders(<DynaNetsuiteAPIVersion {...props} />, {initialStore});
    expect(onFieldChange).not.toHaveBeenCalled();
    const apiVersion1 = screen.getByRole('radio', {name: 'SuiteScript 1.0'});

    userEvent.click(apiVersion1);
    expect(onFieldChange).toHaveBeenCalledWith(props.id, 'false');
  });
});
