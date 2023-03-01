
import React from 'react';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaWebhookTokenGenerator from './DynaWebhookTokenGenerator';
import { renderWithProviders, reduxStore, mutateStore} from '../../../test/test-utils';
import actions from '../../../actions';
import * as mockEnqueSnackbar from '../../../hooks/enqueueSnackbar';

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('../../../utils/string', () => ({ generateUUID: () => '123456789' }));

const enqueueSnackbar = jest.fn();

jest.mock('../../icons/CopyIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../icons/CopyIcon'),
  default: () => (
    <div>CopyIcon</div>
  ),
}));

jest.mock('../../icons/AddIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../icons/AddIcon'),
  default: () => (
    <div>AddIcon</div>
  ),
}));

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.session.form = {
    firstformKey: {value: {'/webhook/verify': 'token', '/webhook/path': 'token'}},
    thisrdformKey: {fields: {defaultVisible: false}, value: 'someValue'},
  };

  draft.session.resource = {someresourceId: 'finalResId'};
});

function initDynaWebhookTokenGenerator(props = {}, initialStore = null) {
  const ui = (
    <DynaWebhookTokenGenerator
      {...props}
    />
  );

  return renderWithProviders(ui, {initialStore});
}

const mockOnFieldChange = jest.fn();

describe('dynaWebhookTokenGenerator UI test cases', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(mockEnqueSnackbar, 'default').mockReturnValue([enqueueSnackbar]);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should click on copy icon and message "Token Copied" should be displayed', async () => {
    initDynaWebhookTokenGenerator({value: 'somevauele', buttonLabel: 'somebuttonLabel'});
    await userEvent.click(screen.getByText('CopyIcon'));
    expect(enqueueSnackbar).toHaveBeenCalledWith({message: 'Token copied to clipboard.'});
  });
  test('should click on Add Icon and call on field function', async () => {
    initDynaWebhookTokenGenerator(
      {
        buttonLabel: 'someButonLabel',
        onFieldChange: mockOnFieldChange,
        id: 'someId',
        setFieldIds: ['value1', 'value2'],
      }
    );
    await userEvent.click(screen.getByText('AddIcon'));
    expect(mockOnFieldChange).toHaveBeenCalledWith('someId', '123456789');
    expect(mockOnFieldChange).toHaveBeenCalledWith('value1', '', true);
    expect(mockOnFieldChange).toHaveBeenCalledWith('value2', '', true);
  });
  test('should click on Add icon and onField function should be called with generated URL', async () => {
    initDynaWebhookTokenGenerator(
      {
        buttonLabel: 'someButonLabel',
        onFieldChange: mockOnFieldChange,
        id: 'someId',
        value: '$',
        resourceId: 'someresourceId',
        provider: 'activecampaign',
      }
    );
    await userEvent.click(screen.getByText('AddIcon'));
    expect(mockOnFieldChange).toHaveBeenCalledWith('someId', '123456789');
    expect(mockOnFieldChange).toHaveBeenCalledWith('webhook.url', 'https://api.localhost/v1/exports/someresourceId/$/data', true);
  });
  test('should call onField function with URl when the provided field has token and webhook path', async () => {
    initDynaWebhookTokenGenerator(
      {
        formKey: 'firstformKey',
        buttonLabel: 'someButonLabel',
        onFieldChange: mockOnFieldChange,
        id: 'someId',
        value: '$',
        resourceId: 'someresourceId',
        provider: 'activecampaign',
      }
    );
    await userEvent.click(screen.getByText('AddIcon'));
    expect(mockOnFieldChange).toHaveBeenCalledWith('someId', '123456789');
    expect(mockOnFieldChange).toHaveBeenCalledWith('webhook.url', 'https://api.localhost/v1/exports/someresourceId/$/data', true);
  });
  test('should verify the dispatch call in useEffect', () => {
    const mockOnFieldChange = jest.fn();
    const patchSet = [
      {
        op: 'replace',
        path: '/webhook/token',
        value: 'somevalue',
      },
    ];

    initDynaWebhookTokenGenerator(
      {
        formKey: 'firstformKey',
        buttonLabel: 'someButonLabel',
        onFieldChange: mockOnFieldChange,
        id: 'someId',
        value: 'somevalue',
        resourceId: 'someresourceId',
        provider: 'activecampaign',
      }, initialStore
    );
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.resource.patchStaged('finalResId', patchSet)
    );
  });
});
