/* global describe, expect, jest, test, afterEach */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../test/test-utils';
import DynaLinkSuiteScriptIntegrator from './DynaLinkSuiteScriptIntegrator';
import { getCreatedStore } from '../../../store';
import actions from '../../../actions';

const mockDispatchFn = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatchFn,
}));

describe('test suite for DynaLinkSuiteScriptIntegrator field', () => {
  afterEach(() => {
    mockDispatchFn.mockClear();
  });

  test('should not show the option if cannot link SuiteScript integrator', () => {
    const props = {
      resourceContext: {
        resourceType: 'imports',
        resourceId: 'import-123',
      },
    };

    renderWithProviders(<DynaLinkSuiteScriptIntegrator {...props} />);
    expect(document.querySelector('body > div')).toBeEmptyDOMElement();
  });

  test('should populate the saved value', () => {
    const onFieldChange = jest.fn();
    const props = {
      onFieldChange,
      id: 'linkSuiteScriptIntegrator',
      label: 'Link Suite Script Integrator',
      resourceContext: {
        resourceType: 'connections',
        resourceId: 'connection-123',
      },
    };
    const initialStore = getCreatedStore();

    initialStore.getState().user.preferences = {
      defaultAShareId: 'own',
      ssConnectionIds: [props.resourceContext.resourceId],
    };
    initialStore.getState().data.resources.connections = [{
      _id: props.resourceContext.resourceId,
      netsuite: { account: 'ns-123' },
    }];
    initialStore.getState().session.suiteScript.account['NS-123'] = {hasIntegrations: true};
    renderWithProviders(<DynaLinkSuiteScriptIntegrator {...props} />, {initialStore});
    expect(document.querySelector('label')).toHaveTextContent(props.label);
    const checkBox = screen.getByRole('checkbox');

    expect(checkBox).toBeChecked();
    userEvent.click(checkBox);
    expect(onFieldChange).toBeCalledWith(props.id, false);
    expect(mockDispatchFn).not.toBeCalled();
  });

  test('should check for integrations only if not checked', () => {
    const props = {
      id: 'linkSuiteScriptIntegrator',
      label: 'Link Suite Script Integrator',
      resourceContext: {
        resourceType: 'connections',
        resourceId: 'connection-123',
      },
    };
    const initialStore = getCreatedStore();

    initialStore.getState().user.preferences = {
      defaultAShareId: 'own',
      ssConnectionIds: [props.resourceContext.resourceId],
    };
    initialStore.getState().data.resources.connections = [{
      _id: props.resourceContext.resourceId,
      netsuite: {account: 'ns-123'},
    }];
    renderWithProviders(<DynaLinkSuiteScriptIntegrator {...props} />, {initialStore});
    expect(mockDispatchFn).toBeCalledWith(actions.suiteScript.account.checkHasIntegrations(props.resourceContext.resourceId));
  });
});
