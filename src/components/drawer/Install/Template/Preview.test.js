
import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import TemplatePreview from './Preview';
import {ConfirmDialogProvider} from '../../../ConfirmDialog';
import actions from '../../../../actions';

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

async function initTemplatePreview(template, data = {}, status = 'success', isCloned = false) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session = {
      templates: {
        _templateId:
          {
            preview: {
              status,
              components: {
                objects: data.model ? [data] : [],
                stackRequired: false,
              },
            },
            runKey: '_templateId',
          },
      },
      integrationApps: {
        clone: {
          _templateId: {isCloned, integrationId: '_integrationId'},
        },
      },
    };
    draft.data = {
      marketplace: {
        templates: [template],
      },
    };
  });

  const ui = (
    <MemoryRouter initialEntries={[{pathname: 'installTemplate/preview/_templateId'}]}>
      <Route
        path="installTemplate/preview/:templateId"
        params={{templateId: '_templateId'}}>
        <ConfirmDialogProvider>
          <TemplatePreview />
        </ConfirmDialogProvider>
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('TemplatePreview tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockHistoryPush.mockClear();
  });
  test('Should able to test the TemplatePreview Without template', async () => {
    await initTemplatePreview({_id: '_wrongTemplateId'});
    expect(screen.getByText('Loading Template...')).toBeInTheDocument();
  });

  test('Should able to test the TemplatePreview With template without user and but connectorId', async () => {
    const sampleTemplate = {_id: '_templateId', name: 'Salesforce template', applications: ['salesforce', 'netsuite'], description: 'For description', _connectorId: '_mockConnectorId'};

    await initTemplatePreview(sampleTemplate);
    expect(screen.getByRole('heading', {name: 'Salesforce template'})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Created by:'})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Company:'})).toBeInTheDocument();
    expect(screen.getByRole('heading', {name: 'Components'})).toBeInTheDocument();
    expect(screen.getByText('For description')).toBeInTheDocument();
    expect(screen.getByText('The following components will be created in your account.')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', {name: 'Name'})).toBeInTheDocument();
    expect(screen.getByRole('columnheader', {name: 'Description'})).toBeInTheDocument();
    const installButton = screen.getByRole('button', {name: 'Install now'});

    expect(installButton).toBeInTheDocument();
    userEvent.click(installButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.template.createComponents('_templateId', '_templateId'));
  });
  test('Should able to test the TemplatePreview With template with user and, not from Celigo', async () => {
    const sampleTemplate = {_id: '_templateId',
      name: 'Netsuite template',
      applications: ['netsuite'],
      user: {
        name: 'mockUser',
        company: 'thirdPartyMockCompany',
      }};

    await initTemplatePreview(sampleTemplate);
    expect(screen.getByRole('heading', {name: 'Netsuite template'})).toBeInTheDocument();
    expect(screen.getByRole('img', {name: 'Application image'})).toBeInTheDocument();
    expect(screen.queryByText('For description')).not.toBeInTheDocument();
    expect(screen.getByText('mockUser')).toBeInTheDocument();
    expect(screen.getByText('thirdPartyMockCompany')).toBeInTheDocument();
    const installButton = screen.getByRole('button', {name: 'Install now'});

    expect(installButton).toBeInTheDocument();
    userEvent.click(installButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.template.createComponents('_templateId', '_templateId'));
  });
  test('Should able to test the TemplatePreview With template with user from Celigo', async () => {
    const sampleTemplate = {_id: '_templateId',
      name: 'Netsuite template',
      applications: ['netsuite'],
      user: {
        name: 'mockCeligoUser',
        company: 'Celigo',
      }};

    await initTemplatePreview(sampleTemplate);
    expect(screen.getByText('mockCeligoUser')).toBeInTheDocument();
    expect(screen.getByText('Celigo')).toBeInTheDocument();
    const installButton = screen.getByRole('button', {name: 'Install now'});

    expect(installButton).toBeInTheDocument();
    userEvent.click(installButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.template.createComponents('_templateId', '_templateId'));
  });

  test('Should able to test the TemplatePreview With template with Readme', async () => {
    const sampleTemplate = {_id: '_templateId', name: 'Netsuite template', applications: ['netsuite']};
    const data = {model: 'Integration', doc: {_id: '_id', name: '_name', description: 'integrationDescription', readme: 'Readme message'}};

    await initTemplatePreview(sampleTemplate, data);
    const readme = screen.getByRole('button', {name: 'View Readme'});

    expect(readme).toBeInTheDocument();
    userEvent.click(readme);
    expect(screen.getByText('Readme')).toBeInTheDocument();
    expect(screen.getByText('Readme message')).toBeInTheDocument();
    expect(screen.getByRole('button', {name: 'Ok'})).toBeInTheDocument();
  });
  test('Should able to test the TemplatePreview With template status = failure', async () => {
    await initTemplatePreview({_id: '_templateId', applications: ['netsuite']}, {}, 'failure');
    expect(screen.queryByText('Loading Template...')).not.toBeInTheDocument();
    expect(screen.queryByText('Components')).not.toBeInTheDocument();
  });
  test('Should able to test the TemplatePreview For clone Integration Setup', async () => {
    await initTemplatePreview({_id: '_templateId', applications: ['netsuite']}, {}, 'success', true);

    await waitFor(() => expect(mockHistoryPush).toHaveBeenCalledWith('/integrations/_integrationId/setup'));
  });
});
