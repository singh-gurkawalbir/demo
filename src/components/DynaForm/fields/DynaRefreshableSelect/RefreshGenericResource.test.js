
import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Typography } from '@mui/material';
import {mutateStore, renderWithProviders} from '../../../../test/test-utils';
import RefreshGenericResource from './RefreshGenericResource';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

function initRefreshGenericResource(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.metadata = {application: {'5efd8663a56953365bd28541': {
      'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote': {
        data: props.data,
        status: 'success',
        errorMessage: 'Test Error Message',
      },
    },
    }};
    draft.data.resources = {
      connections: [{
        _id: '5efd8663a56953365bd28541',
        offline: props.offline,
      }],
    };
  });

  return renderWithProviders(<RefreshGenericResource {...props} />, {initialStore});
}
const mockOpenUrl = jest.fn();

jest.mock('../../../../utils/window', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../utils/window'),
  default: props => mockOpenUrl(props),
}));

describe('refreshGenericResource UI tests', () => {
  const mockonFieldChange = jest.fn();
  const mockOnRefresh = jest.fn();
  const mockOnFetch = jest.fn();
  const props = {
    connectionId: '5efd8663a56953365bd28541',
    commMetaPath: 'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote',
    filterKey: 'salesforce-sObject-layout',
    fieldData: [],
    data: [{searchLayoutable: true}],
    bundleUrlHelp: 'test url',
    bundlePath: 'test path',
    onFieldChange: mockonFieldChange,
    disableFetch: false,
    ignoreValidation: false,
    children: <Typography>Child Component</Typography>,
    urlToOpen: 'demo url',
    resourceToFetch: true,
    onRefresh: mockOnRefresh,
    onFetch: mockOnFetch,
    fieldError: 'demo Error',
    disableOptionsLoad: true,
    fieldDescription: 'demo description ',
  };

  test('should pass the initial render', () => {
    initRefreshGenericResource(props);
    expect(screen.getByText('Child Component')).toBeInTheDocument();
    const openResButton = document.querySelector('[data-test="openResource"]');

    expect(openResButton).toBeInTheDocument();
    const removeRefreshButton = document.querySelector('[data-test="refreshResource"]');

    expect(removeRefreshButton).toBeInTheDocument();
  });
  test('should not render the buttons when removeRefresh prop is true and urlToOpen is absent', () => {
    initRefreshGenericResource({...props, removeRefresh: true, urlToOpen: undefined});
    expect(screen.queryByRole('button')).toBeNull();
  });
  test('should call the openExternalUrl when clicked on openResource button', async () => {
    initRefreshGenericResource(props);
    const openResButton = document.querySelector('[data-test="openResource"]');

    expect(openResButton).toBeInTheDocument();
    await userEvent.click(openResButton);
    await waitFor(() => expect(mockOpenUrl).toHaveBeenCalledWith({ url: props.urlToOpen }));
  });
  test('should call the onRefresh button passed in props when clicked on removeRefresh button', async () => {
    initRefreshGenericResource(props);
    const removeRefreshButton = document.querySelector('[data-test="refreshResource"]');

    expect(removeRefreshButton).toBeInTheDocument();
    await userEvent.click(removeRefreshButton);
    expect(mockOnRefresh).toHaveBeenCalled();
  });
  test('should call the onFieldChange function passed in props when resourceToFetch prop is true', () => {
    initRefreshGenericResource(props);
    expect(mockonFieldChange).toHaveBeenCalled();
  });
  test('should call the onFetch function when disableOptionsLoad prop is false and fieldData is not passed', () => {
    initRefreshGenericResource({...props, disableOptionsLoad: false, fieldData: undefined});
    expect(mockOnFetch).toHaveBeenCalled();
  });
  test('should call the onFieldChange function when selected option is not present in the options list', () => {
    initRefreshGenericResource({...props, value: 'not default value'});
    expect(mockonFieldChange).toHaveBeenCalled();
  });
});
