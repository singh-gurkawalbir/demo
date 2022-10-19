/* global describe, test, expect, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {renderWithProviders, reduxStore} from '../../test/test-utils';
import AddOrSelect from './AddOrSelect';

const mockonSubmitComplete = jest.fn();
const mockonClose = jest.fn();

const connections = [
  {
    _id: '56d6b7786f8ed15e4d0f9b91',
    createdAt: '2019-02-25T15:45:33.131Z',
    lastModified: '2022-07-14T02:19:55.849Z',
    type: 'netsuite',
    name: 'Netsuite-connection',
    offline: true,
    netsuite: {
      account: 'TSTDRV1389770',
      roleId: '3',
      email: 'autouser2@foobar.com',
      password: '******',
      environment: 'production',
      requestLevelCredentials: false,
      dataCenterURLs: {
        restDomain: 'https://tstdrv1389770.restlets.api.netsuite.com',
        webservicesDomain: 'https://tstdrv1389770.suitetalk.api.netsuite.com',
        systemDomain: 'https://tstdrv1389770.app.netsuite.com',
      },
      concurrencyLevel: 2,
      suiteAppInstalled: false,
    },
    queues: [
      {
        name: '56d6b7786f8ed15e4d0f9b91',
        size: 0,
      },
    ],
  },
  {
    _id: '56d6b7786f8ed15e4d0f9b92',
    createdAt: '2019-02-25T15:45:33.131Z',
    lastModified: '2022-07-14T02:19:55.849Z',
    type: 'netsuite',
    name: 'Netsuite-connection',
    offline: false,
    netsuite: {
      account: 'TSTDRV1389770',
      roleId: '3',
      email: 'autouser2@foobar.com',
      password: '******',
      environment: 'production',
      requestLevelCredentials: false,
      dataCenterURLs: {
        restDomain: 'https://tstdrv1389770.restlets.api.netsuite.com',
        webservicesDomain: 'https://tstdrv1389770.suitetalk.api.netsuite.com',
        systemDomain: 'https://tstdrv1389770.app.netsuite.com',
      },
      concurrencyLevel: 2,
      suiteAppInstalled: false,
    },
    queues: [
      {
        name: '56d6b7786f8ed15e4d0f9b91',
        size: 0,
      },
    ],
  },
];

const initialStore = reduxStore;

initialStore.getState().data.resources.connections = connections;

initialStore.getState().user.preferences = {
  environment: 'production',
  defaultAShareId: 'own',
};

jest.mock('../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../LoadResources'),
  default: props => (
    <>
      {props.children}
    </>
  ),
}));
jest.mock('../ResourceFormWithStatusPanel', () => ({
  __esModule: true,
  ...jest.requireActual('../ResourceFormWithStatusPanel'),
  default: props => (
    <>
      <button type="button" onClick={props.onSubmitComplete}>StatusPanelonSubmitComplete</button>
    </>
  ),
}));
jest.mock('../drawer/Resource/Panel/ResourceFormActionsPanel', () => ({
  __esModule: true,
  ...jest.requireActual('../drawer/Resource/Panel/ResourceFormActionsPanel'),
  default: props => (
    <>
      <button type="button" onClick={props.onSubmitComplete}>Save & close</button>
      <button type="button" onClick={props.onCancel}>Cancel</button>
    </>
  ),
}));

function renderFunction() {
  renderWithProviders(
    <MemoryRouter>
      <AddOrSelect
        resourceId="resourceId"
        resource={{type: 'netsuite'}}
        onSubmitComplete={mockonSubmitComplete}
        connectionType="netsuite"
        onClose={mockonClose}
        formKey="resourceId-"
        />
    </MemoryRouter>, {initialStore});
}

describe('ResourceDrawer UI test', () => {
  test('should call the submitfunction on clicking Done after selecting the required connection', () => {
    renderFunction();
    userEvent.click(screen.getByText('Use existing connection'));
    userEvent.click(screen.getByText('Please select'));
    userEvent.click(screen.getByText('Netsuite-connection - Offline'));
    userEvent.click(screen.getByText('Done'));

    expect(mockonSubmitComplete).toHaveBeenCalled();
  });

  test('should call the onsubmitcomplete function from ResourceFormWithStatusPanel component', () => {
    renderFunction();
    userEvent.click(screen.getByText('StatusPanelonSubmitComplete'));
    expect(mockonSubmitComplete).toHaveBeenCalled();
  });
  test('should call the close function', () => {
    renderFunction();
    userEvent.click(screen.getByText('Save & close'));
    expect(mockonSubmitComplete).toHaveBeenCalled();
    userEvent.click(screen.getByText('Cancel'));
    expect(mockonClose).toHaveBeenCalled();
  });
});
