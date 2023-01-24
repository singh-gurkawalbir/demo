import { screen } from '@testing-library/react';
import React from 'react';
import IntegrationAppUninstallation from '.';
import { getCreatedStore } from '../../../../../store';
import { renderWithProviders } from '../../../../../test/test-utils';

let initialStore;

jest.mock('./Uninstall2.0', () => ({
  __esModule: true,
  ...jest.requireActual('./Uninstall2.0'),
  default: props => (
    <div>
      <div>Mock Uninstall 2.0</div>
      <div>integration = {JSON.stringify(props.integration)}</div>
      <div>integrationId = {props.integrationId}</div>
    </div>
  ),
}));

jest.mock('./Uninstall1.0', () => ({
  __esModule: true,
  ...jest.requireActual('./Uninstall1.0'),
  default: props => (
    <div>
      <div>Mock Uninstall 1.0</div>
      <div>integration = {JSON.stringify(props.integration)}</div>
      <div>integrationId = {props.integrationId}</div>
      <div>childId = {props.childId}</div>
    </div>
  ),
}));

function initIntegrationAppUninstallation({match, integrationsData, uninstaller2Data}) {
  initialStore.getState().data.resources.integrations = integrationsData;
  initialStore.getState().session.integrationApps.uninstaller2 = uninstaller2Data;
  const ui = (
    <IntegrationAppUninstallation match={match} />
  );

  return renderWithProviders(ui, {initialStore});
}

describe('Testsuite for IntegrationAppUninstallation', () => {
  beforeEach(() => {
    initialStore = getCreatedStore();
  });
  test('should test the uninstaller 2 when the isFramework 2 is set to true and when there is a child id', () => {
    initIntegrationAppUninstallation({
      match: {
        params: {
          integrationId: 'integrationId',
          childId: 'childId',
        },
      },
      integrationsData: [
        {
          _id: 'integrationId',
          name: 'integration Name',
          _connectorId: 'connectorId',
          settings: {
            sections: [
              {
                id: 'childId',
                title: 'section title',
                hidden: true,
                mode: 'settings',
              },
            ],
            supportsMultiStore: true,
          },
          installSteps: [
            {
              type: 'url',
              stepName: 'stepName',
              stepId: 'stepId',
              completed: false,
            },
          ],
          children: [{
            label: 'Test Label',
            hidden: false,
            mode: 'uninstall',
            value: 'childId',
          }],
        },
        {
          _id: 'childId',
          name: 'Child integration Name',
          _connectorId: 'connectorId',
          settings: {
            sections: [
              {
                id: 'childId',
                title: 'section title',
                hidden: true,
                mode: 'settings',
              },
            ],
            supportsMultiStore: true,
          },
          installSteps: [
            {
              type: 'url',
              stepName: 'stepName',
              stepId: 'stepId',
              completed: false,
            },
          ],
          children: [{
            label: 'Test Label',
            hidden: false,
            mode: 'uninstall',
            value: 'childId',
          }],
        },
      ],
      uninstaller2Data: {
        integrationId: {
          steps: [
            {
              type: 'url',
              stepName: 'stepName',
              stepId: 'stepId',
              completed: false,
            },
          ],
          isFetched: true,
          error: true,
          isComplete: true,
        },
      },
    });
    expect(screen.getByText(/Mock Uninstall 2.0/i)).toBeInTheDocument();
    expect(screen.getByText(
      /integration = \{"name":"child integration name","_id":"childid","children":\[\{"label":"section title","hidden":true,"mode":"settings","value":"childid"\}\],"installsteps":\[\{"type":"url","stepname":"stepname","stepid":"stepid","completed":false\}\]\}/i
    )).toBeInTheDocument();
    expect(screen.getByText(/integrationid = childid/i)).toBeInTheDocument();
  });
  test('should test the uninstaller 2 when the isFramework 2 is set to true and when there is no child integrations', () => {
    initIntegrationAppUninstallation({
      match: {
        params: {
          integrationId: 'integrationId',
        },
      },
      integrationsData: [
        {
          _id: 'integrationId',
          name: 'integration Name',
          _connectorId: 'connectorId',
          installSteps: [
            {
              type: 'url',
              stepName: 'stepName',
              stepId: 'stepId',
              completed: false,
            },
          ],
        },
      ],
      uninstaller2Data: {
        integrationId: {
          steps: [
            {
              type: 'url',
              stepName: 'stepName',
              stepId: 'stepId',
              completed: false,
            },
          ],
          isFetched: true,
          error: true,
          isComplete: true,
        },
      },
    });
    expect(screen.getByText(/Mock Uninstall 2.0/i)).toBeInTheDocument();
    expect(screen.getByText(
      /integration = \{"name":"integration name","_id":"integrationid","installsteps":\[\{"type":"url","stepname":"stepname","stepid":"stepid","completed":false\}\],"settings":\{\}\}/i
    )).toBeInTheDocument();
    expect(screen.getByText(/integrationid = integrationid/i)).toBeInTheDocument();
  });
  test('should test the uninstaller 1 when the isFramework 2 is set to false and when there is a child id', () => {
    initIntegrationAppUninstallation({
      match: {
        params: {
          integrationId: 'integrationId',
          childId: 'childId',
        },
      },
      integrationsData: [
        {
          _id: 'integrationId',
          name: 'integration Name',
          _connectorId: 'connectorId',
          settings: {
            sections: [
              {
                id: 'section id',
                title: 'section title',
                hidden: true,
                mode: 'settings',
              },
            ],
            supportsMultiStore: true,
          },
          installSteps: [],
          children: [{
            label: 'Test Label',
            hidden: false,
            mode: 'uninstall',
            value: 'childId',
          }],
        },
        {
          _id: 'childId',
          name: 'Child integration Name',
          _connectorId: 'connectorId',
          settings: {
            sections: [
              {
                id: 'childId',
                title: 'section title',
                hidden: true,
                mode: 'settings',
              },
            ],
            supportsMultiStore: true,
          },
          installSteps: [],
          children: [{
            label: 'Test Label',
            hidden: false,
            mode: 'uninstall',
            value: 'childId',
          }],
        },
      ],
      uninstaller2Data: {
        integrationId: {
          steps: [
            {
              type: 'url',
              stepName: 'stepName',
              stepId: 'stepId',
              completed: false,
            },
          ],
          isFetched: true,
          error: true,
          isComplete: true,
        },
      },
    });
    expect(screen.getByText(/mock uninstall 1\.0/i)).toBeInTheDocument();
    expect(screen.getByText(
      /integration = \{"name":"integration name","_id":"integrationid","children":\[\{"label":"section title","hidden":true,"mode":"settings","value":"section id"\}\],"installsteps":\[\],"settings":\{"sections":\[\{"id":"section id","title":"section title","hidden":true,"mode":"settings"\}\],"supportsmultistore":true\}\}/i
    )).toBeInTheDocument();
    expect(screen.getByText(/integrationid = integrationId/i)).toBeInTheDocument();
    expect(screen.getByText(/childId = childId/i)).toBeInTheDocument();
  });
  test('should test the IntegrationAppUninstallation when integrations are not loaded', () => {
    const { utils } = initIntegrationAppUninstallation({
      match: {
        params: {
          integrationId: 'integrationId',
        },
      },
      integrationsData: undefined,
      uninstaller2Data: {
      },
    });

    expect(utils.container).toBeEmptyDOMElement();
  });
});
