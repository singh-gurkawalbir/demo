
/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter, Router} from 'react-router-dom';
import {createMemoryHistory} from 'history';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../test/test-utils';
import FormBuilderButton from '.';

const history = createMemoryHistory();

async function BuilderButton(props = {resourceId: null,
  resourceType: '',
  integrationId: null,
  sectionId: null}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.resources.integrations = [{
      _id: '626bda66987bb423914b486f',
      lastModified: '2022-04-29T12:31:49.587Z',
      name: 'development',
      description: 'demo integration',
      install: [],
      mode: 'settings',
      sandbox: false,
      _registeredConnectionIds: [
        '626bda95c087e064dcc7f501',
        '626bdaafc087e064dcc7f505',
      ],
      installSteps: [
        {
          name: 'REST API connection',
          completed: true,
          type: 'connection',
          sourceConnection: {
            type: 'http',
            name: 'REST API connection',
            http: {
              formType: 'rest',
            },
          },
        },
        {
          name: 'demo REST',
          completed: true,
          type: 'connection',
          sourceConnection: {
            type: 'http',
            name: 'demo REST',
            http: {
              formType: 'rest',
            },
          },
        },
        {
          name: 'Copy resources now from template zip',
          completed: true,
          type: 'template_zip',
          templateZip: true,
          isClone: true,
        },
      ],
      uninstallSteps: [],
      flowGroupings: [],
      createdAt: '2022-04-29T12:30:30.857Z',
      _sourceId: '626bd993987bb423914b484f',
    }];
    draft.user.profile = {
      _id: '625e84b4a2bca9036eb61252',
      name: 'demo user',
      email: 'demouser@celigo.com',
      role: 'CEO',
      company: 'celigo',
      phone: '1234567890',
      auth_type_google: {},
      timezone: 'demo location',
      developer: true,
      allowedToPublish: true,
      agreeTOSAndPP: true,
      createdAt: '2022-04-19T09:45:25.111Z',
      useErrMgtTwoDotZero: true,
      authTypeSSO: null,
      emailHash: '087e41a1843139c27bce730b99664a84',
    };
  });

  const ui = (
    <Router history={history}>
      <FormBuilderButton {...props} />
    </Router>
  );

  return renderWithProviders(ui, { initialStore });
}
describe('formbuilder button UI tests', () => {
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
  });
  jest.spyOn(history, 'push').mockImplementation();
  test('should display the button and make a dispatch call when clicked on it', async () => {
    const props = {resourceId: '626a1dd0d0d946269d48d379',
      resourceType: 'integrations',
      integrationId: '626a1dd0d0d946269d48d379',
      sectionId: null};

    await BuilderButton(props);
    const button = screen.getByText('Launch form builder');

    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    expect(mockDispatchFn).toHaveBeenCalledTimes(1);
    expect(history.push).toHaveBeenCalledTimes(1);
  });
  test('should render empty DOM when no props are passed', () => {
    const {utils} = renderWithProviders(<MemoryRouter><FormBuilderButton /></MemoryRouter>);

    expect(utils.container).toBeEmptyDOMElement();
  });
});

