
import React from 'react';
import {
  waitFor, screen,
} from '@testing-library/react';
import * as reactRedux from 'react-redux';
import userEvent from '@testing-library/user-event';
import {MemoryRouter, Route} from 'react-router-dom';
import DynaFileDefinitionEditor from './index';
import { mutateStore, renderWithProviders} from '../../../../test/test-utils';
import {getCreatedStore} from '../../../../store';

const initialStore = getCreatedStore();

async function initFileDefinitionEditor(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.editors = {filecsv: {
      id: props.id,
      fieldId: 'fieldId',
      formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
      resourceId: '5b3c75dd5d3c125c88b5dd20',
      resourceType: 'imports',
      rule: {
        customHeaderRows: 'custom value',
        columnDelimiter: 'Comma (,)',
        rowDelimiter: 'LF (\\n)',
        includeHeader: false,
        truncateLastRowDelimiter: false,
        wrapWithQuotes: false,
        replaceTabWithSpace: false,
        replaceNewlineWithSpace: false,
      },
    },
    };

    draft.data.fileDefinitions = {preBuiltFileDefinitions: {data: {format: [{value: 'definitionId',
      template: {
        generate: {sampleData: '{}'},
        parse: {sampleData: {

        }} }}]}}};

    draft.session.form = {'imports-5b3c75dd5d3c125c88b5dd20': { fields: {
      fieldId: {
        options: {
          format: 'format',
          definitionId: 'definitionId',
        },
        value: 'value',
        userDefinitionId: 'definition',
        fileDefinitionResourcePath: 'respurcePath',
        disabled: props.disabled,
      },
    },
    }};
  });

  return renderWithProviders(
    <MemoryRouter initialEntries={[{pathname: '/filecsv'}]}>
      <Route path="/:editorId">
        <DynaFileDefinitionEditor {...props} />
      </Route>
    </MemoryRouter>, {initialStore});
}

jest.mock('../../../LoadResources', () => ({
  __esModule: true,
  ...jest.requireActual('../../../LoadResources'),
  default: props => (
    <div>{props.children}</div>
  ),
}));

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));

describe('dynaFileDefinitionEditor_afe UI tests', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(done => {
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default: initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
    done();
  });
  afterEach(async () => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });
  const mockOnFieldChange = jest.fn();

  const props = {
    id: 'fieldId',
    label: 'Form label',
    resourceId: '5b3c75dd5d3c125c88b5dd20',
    resourceType: 'imports',
    onFieldChange: mockOnFieldChange,
    formKey: 'imports-5b3c75dd5d3c125c88b5dd20',
    flowId: '6b3c75dd5d3c125c88b5dd20',
  };

  test('should pass the initial render', () => {
    initFileDefinitionEditor(props);
    expect(screen.getByText('Form label')).toBeInTheDocument();
    expect(screen.getByText('Launch')).toBeInTheDocument();
  });
  test('should make a dispatch call when clicked on Launch button', async () => {
    initFileDefinitionEditor(props);
    const LaunchButton = screen.getByText('Launch');

    expect(LaunchButton).toBeInTheDocument();
    await userEvent.click(LaunchButton);
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalled());
    await waitFor(() => expect(mockHistoryPush).toBeCalledWith('/filecsv/editor/fieldId'));
  });
});
