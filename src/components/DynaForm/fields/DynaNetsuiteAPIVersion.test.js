import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mutateStore, renderWithProviders } from '../../../test/test-utils';
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
              label: 'SuiteApp SuiteScript 2.x (Recommended)',
              value: 'suiteapp2.0',
            },
            {
              label: 'SuiteApp SuiteScript 1.0',
              value: 'suiteapp1.0',
            },
            {
              label: 'SuiteBundle SuiteScript 1.0',
              value: 'suitebundle',
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

    expect(onFieldChange).toHaveBeenCalledWith(props.id, 'suiteapp2.0');
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.metadata.getBundleInstallStatus(props.connectionId));
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    unmount();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resourceForm.hideBundleInstallNotification(props.resourceType, props.resourceId));
  });

  test('should populate the SuiteApp SuiteScript 2.x radio button value when the resource is being created', () => {
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
              label: 'SuiteApp SuiteScript 2.x (Recommended)',
              value: 'suiteapp2.0',
            },
            {
              label: 'SuiteApp SuiteScript 1.0',
              value: 'suiteapp1.0',
            },
            {
              label: 'SuiteBundle SuiteScript 1.0',
              value: 'suitebundle',
            },
          ],
        },
      ],
      isNew: true,
      connectionId: 'connection-123',
      id: 'netsuite.restlet.useSS2Restlets',
      name: '/netsuite/restlet/useSS2Restlets',
      formKey: 'exports-new-So3JJHSqd4',
      value: 'suiteapp2.0',
      visible: true,
      isValid: true,
    };

    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.metadata.application[props.connectionId] = {
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
    });
    renderWithProviders(<DynaNetsuiteAPIVersion {...props} />, {initialStore});
    expect(onFieldChange).toHaveBeenCalledWith(props.id, 'suiteapp2.0');
    const radioGroup = screen.getByRole('radiogroup', {name: props.label});
    const apiVersions = screen.getAllByRole('radio');

    expect(radioGroup).toBeInTheDocument();
    expect(apiVersions).toHaveLength(3);
    apiVersions.forEach(apiVersion => expect(radioGroup).toContainElement(apiVersion));
    const selectedVersion = apiVersions.find(apiVersion => apiVersion.value === props.value);

    expect(selectedVersion).toBeChecked();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.metadata.getBundleInstallStatus(props.connectionId));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resourceForm.hideBundleInstallNotification(props.resourceType, props.resourceId));
  });

  test('should make a dispatch call to show suiteapp install notification when the integrator suiteApp is not installed in the NS account', () => {
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
              label: 'SuiteApp SuiteScript 2.x (Recommended)',
              value: 'suiteapp2.0',
            },
            {
              label: 'SuiteApp SuiteScript 1.0',
              value: 'suiteapp1.0',
            },
            {
              label: 'SuiteBundle SuiteScript 1.0',
              value: 'suitebundle',
            },
          ],
        },
      ],
      isNew: true,
      connectionId: 'connection-123',
      id: 'netsuite.restlet.useSS2Restlets',
      name: '/netsuite/restlet/useSS2Restlets',
      formKey: 'exports-new-So3JJHSqd4',
      value: 'suiteapp2.0',
      visible: true,
      isValid: true,
    };

    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.metadata.application[props.connectionId] = {
        [`connections/${props.connectionId}/distributedApps`]: {
          data: {
            bundle: {
              success: true,
            },
            suiteapp: {
              URL: '/demourl/demochildurl',
            },
          },
          status: 'received',
        },
      };
    });
    renderWithProviders(<DynaNetsuiteAPIVersion {...props} />, {initialStore});
    expect(onFieldChange).toHaveBeenCalledWith(props.id, 'suiteapp2.0');
    const radioGroup = screen.getByRole('radiogroup', {name: props.label});
    const apiVersions = screen.getAllByRole('radio');

    expect(radioGroup).toBeInTheDocument();
    expect(apiVersions).toHaveLength(3);
    apiVersions.forEach(apiVersion => expect(radioGroup).toContainElement(apiVersion));
    const selectedVersion = apiVersions.find(apiVersion => apiVersion.value === props.value);

    expect(selectedVersion).toBeChecked();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.metadata.getBundleInstallStatus(props.connectionId));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resourceForm.hideBundleInstallNotification(props.resourceType, props.resourceId));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resourceForm.showSuiteAppInstallNotification('/demourl/demochildurl', props.resourceType, props.resourceId));
  });

  test('should make a showSuiteappInstall dispatch call when the integrator suiteApp is not installed in the NS account and SuiteApp SuiteScript 1.0 is selected', async () => {
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
              label: 'SuiteApp SuiteScript 2.x (Recommended)',
              value: 'suiteapp2.0',
            },
            {
              label: 'SuiteApp SuiteScript 1.0',
              value: 'suiteapp1.0',
            },
            {
              label: 'SuiteBundle SuiteScript 1.0',
              value: 'suitebundle',
            },
          ],
        },
      ],
      isNew: true,
      connectionId: 'connection-123',
      id: 'netsuite.restlet.useSS2Restlets',
      name: '/netsuite/restlet/useSS2Restlets',
      formKey: 'exports-new-So3JJHSqd4',
      value: 'suiteapp2.0',
      visible: true,
      isValid: true,
    };

    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.metadata.application[props.connectionId] = {
        [`connections/${props.connectionId}/distributedApps`]: {
          data: {
            bundle: {
              success: true,
            },
            suiteapp: {
              URL: '/demourl/demochildurl',
            },
          },
          status: 'received',
        },
      };
    });
    renderWithProviders(<DynaNetsuiteAPIVersion {...props} />, {initialStore});
    expect(onFieldChange).toHaveBeenCalledWith(props.id, 'suiteapp2.0');
    const radioGroup = screen.getByRole('radiogroup', {name: props.label});
    const apiVersions = screen.getAllByRole('radio');

    expect(radioGroup).toBeInTheDocument();
    expect(apiVersions).toHaveLength(3);
    apiVersions.forEach(apiVersion => expect(radioGroup).toContainElement(apiVersion));
    const selectedVersion = apiVersions.find(apiVersion => apiVersion.value === props.value);

    expect(selectedVersion).toBeChecked();

    const apiVersion1 = screen.getByRole('radio', {name: 'SuiteApp SuiteScript 1.0'});

    await userEvent.click(apiVersion1);
    expect(onFieldChange).toHaveBeenCalledWith(props.id, 'suiteapp1.0');
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.metadata.getBundleInstallStatus(props.connectionId));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resourceForm.hideBundleInstallNotification(props.resourceType, props.resourceId));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resourceForm.showSuiteAppInstallNotification('/demourl/demochildurl', props.resourceType, props.resourceId));
  });
  test('should show the Install suitbeundle notification when the user selects the suitebundle option and Integrator SuiteBundle is not installed in NS account', () => {
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
              label: 'SuiteApp SuiteScript 2.x (Recommended)',
              value: 'suiteapp2.0',
            },
            {
              label: 'SuiteApp SuiteScript 1.0',
              value: 'suiteapp1.0',
            },
            {
              label: 'SuiteBundle SuiteScript 1.0',
              value: 'suitebundle',
            },
          ],
        },
      ],
      isNew: true,
      connectionId: 'connection-123',
      id: 'netsuite.restlet.useSS2Restlets',
      name: '/netsuite/restlet/useSS2Restlets',
      formKey: 'exports-new-So3JJHSqd4',
      value: 'suitebundle',
      visible: true,
      isValid: true,
    };

    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.metadata.application[props.connectionId] = {
        [`connections/${props.connectionId}/distributedApps`]: {
          data: {
            bundle: {
              URL: '/demourl/demochildurl',
            },
            suiteapp: {
              success: true,
            },
          },
          status: 'received',
        },
      };
    });
    renderWithProviders(<DynaNetsuiteAPIVersion {...props} />, {initialStore});
    expect(onFieldChange).toHaveBeenCalledWith(props.id, 'suiteapp2.0');
    const radioGroup = screen.getByRole('radiogroup', {name: props.label});
    const apiVersions = screen.getAllByRole('radio');

    expect(radioGroup).toBeInTheDocument();
    expect(apiVersions).toHaveLength(3);
    apiVersions.forEach(apiVersion => expect(radioGroup).toContainElement(apiVersion));
    const selectedVersion = apiVersions.find(apiVersion => apiVersion.value === props.value);

    expect(selectedVersion).toBeChecked();

    expect(mockDispatchFn).toHaveBeenCalledWith(actions.metadata.getBundleInstallStatus(props.connectionId));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resourceForm.hideSuiteAppInstallNotification(props.resourceType, props.resourceId));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resourceForm.showBundleInstallNotification('/demourl/demochildurl', props.resourceType, props.resourceId));
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
              label: 'SuiteApp SuiteScript 2.x (Recommended)',
              value: 'false',
            },
            {
              label: 'SuiteApp SuiteScript 1.0',
              value: 'true',
            },
            {
              label: 'SuiteBundle SuiteScript 1.0',
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
      value: 'suitebundle',
      visible: true,
    };

    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.metadata.application[props.connectionId] = {
        [`connections/${props.connectionId}/distributedApps`]: {
          data: {
            suiteapp: { URL: 'https://sampleURL.com'},
            bundle: {URL: 'https://sampleBundleURL.com'},
          },
          errorMessage: 'Invalid URL',
          status: 'received',
        },
      };
    });
    renderWithProviders(<DynaNetsuiteAPIVersion {...props} />, {initialStore});
    expect(onFieldChange).not.toHaveBeenCalled();
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.resourceForm.showBundleInstallNotification('https://sampleBundleURL.com', props.resourceType, props.resourceId));
    expect(screen.getByText('Invalid URL')).toBeInTheDocument();
  });

  test('should be able to switch between the available versions', async () => {
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
              label: 'SuiteApp SuiteScript 2.x (Recommended)',
              value: 'suiteapp2.0',
            },
            {
              label: 'SuiteApp SuiteScript 1.0',
              value: 'suiteapp1.0',
            },
            {
              label: 'SuiteBundle SuiteScript 1.0',
              value: 'suitebundle',
            },
          ],
        },
      ],
      connectionId: 'connection-123',
      id: 'netsuite.restlet.useSS2Restlets',
      name: '/netsuite/restlet/useSS2Restlets',
      formKey: 'exports-So3JJHSqd4',
      value: 'suiteapp2.0',
      visible: true,
      isValid: true,
    };

    const initialStore = getCreatedStore();

    mutateStore(initialStore, draft => {
      draft.session.metadata.application[props.connectionId] = {
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
    });
    renderWithProviders(<DynaNetsuiteAPIVersion {...props} />, {initialStore});
    expect(onFieldChange).not.toHaveBeenCalled();
    const apiVersion1 = screen.getByRole('radio', {name: 'SuiteBundle SuiteScript 1.0'});

    await userEvent.click(apiVersion1);
    expect(onFieldChange).toHaveBeenCalledWith(props.id, 'suitebundle');
  });
});
