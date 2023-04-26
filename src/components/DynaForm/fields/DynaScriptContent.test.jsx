
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import {screen} from '@testing-library/react';
import { MemoryRouter, Route } from 'react-router-dom';
import DynaScriptContent from './DynaScriptContent';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import scriptHookStubs from '../../../utils/scriptHookStubs';
import actions from '../../../actions';

const initialStore = reduxStore;
const mockDispatch = jest.fn();

jest.mock('../../CodeEditor', () => ({
  __esModule: true,
  ...jest.requireActual('../../CodeEditor'),
  default: props => {
    let value;

    if (typeof props.value === 'string') {
      value = props.value;
    } else {
      value = JSON.stringify(props.value);
    }
    const handleUpdate = event => {
      props.onFieldChange(props.id, event.target.value);
    };

    return (
      <>
        <textarea name="codeEditor" data-test="code-editor" value={value} onChange={handleUpdate} />
      </>
    );
  },
}
));

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

const mockOnFieldChange = jest.fn();

function initDynaScriptContent(props = {}) {
  const ui = (
    <MemoryRouter
      initialEntries={[{pathname: '/scripts/edit/scripts/63868bb98dab534c4614b398'}]}
    >
      <Route
        path="/scripts/edit/scripts/63868bb98dab534c4614b398"
      >
        <DynaScriptContent
          {...props}
  />
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

describe('dynaScriptContent UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('script content should be displayed in the script drawer', () => {
    mutateStore(initialStore, draft => {
      draft.session.stage = {
        new638538b6c7d76c583e7593da: {
          master: null,
          patch: [
            {
              op: 'replace',
              path: '/_id',
              value: 'new-uwmt5Mi92',
              timestamp: 1657615760352,
            },
          ],
        },
      };
      draft.data.resources.scripts = [{
        _id: 'new638538b6c7d76c583e7593da',
        data: 'somedata',
        lastModified: '2022-03-29T10:32:37.093Z',
        createdAt: '2022-03-29T10:32:36.916Z',
        content: '123',
        name: 'Snowflake Data Warehouse Script [v1.1.1]',
        description: 'Used by Snowflake Data Warehouse template',
        _sourceId: '611f3c33e3488c6cb37b8bd1',
      }];
    });
    const data =
    {id: 'content',
      onFieldChange: mockOnFieldChange,
      resourceId: 'new638538b6c7d76c583e7593da',
      value: 'function preSavePage (options) {return "presave";}',
      options: {scriptFunctionStub: 'preSavePage', file: 'json'},
      formKey: 34,
    };

    initDynaScriptContent(data);
    expect(screen.getByText('function preSavePage (options) {return "presave";}')).toBeInTheDocument();
  });

  test('mock on field change should be called when the script content is updated', () => {
    mutateStore(initialStore, draft => {
      draft.session.stage = {
        new638538b6c7d76c583e7593da: {
          master: null,
          patch: [
            {
              op: 'replace',
              path: '/_id',
              value: 'new-uwmt5Mi92',
              timestamp: 1657615760352,
            },
          ],
        },
      };
      draft.data.resources.scripts = [{
        _id: 'new638538b6c7d76c583e7593da',
        data: 'somedata',
        lastModified: '2022-03-29T10:32:37.093Z',
        createdAt: '2022-03-29T10:32:36.916Z',
        content: '123',
        name: 'Snowflake Data Warehouse Script [v1.1.1]',
        description: 'Used by Snowflake Data Warehouse template',
        _sourceId: '611f3c33e3488c6cb37b8bd1',
      }];
    });
    const data =
    {id: 'content',
      onFieldChange: mockOnFieldChange,
      resourceId: 'new638538b6c7d76c583e7593da',
      value: 'function preSavePage (options) {return "sometext";}',
      options: {scriptFunctionStub: 'preSavePage', file: 'json'},
      formKey: 34,
      isLoggable: true,
      mode: 'json',
      required: false,
      isValid: true,
      label: 'Edit content',

    };

    initDynaScriptContent(data);
    const textBoxNode = screen.getAllByRole('textbox').find(eachOption => eachOption.getAttribute('data-test') === 'code-editor');

    expect(textBoxNode).toBeInTheDocument();
    expect(document.querySelector('textarea[data-test="code-editor"]')).toHaveTextContent('function preSavePage (options) {return "sometext";}');
    expect(mockOnFieldChange).toHaveBeenCalledWith('content', '123', true);
    const updatedScriptContent =
        `function preSavePage (options) {return "sometext";}${scriptHookStubs.preSavePage}`;

    expect(mockOnFieldChange).toHaveBeenCalledWith('content', updatedScriptContent, true);
  });
  test('should be able to test the script drawer when the script content is undefined', () => {
    const data = {
      id: 'content',
      onFieldChange: mockOnFieldChange,
      resourceId: '638538b6c7d76c583e7593da',
      value: 'function preSavePage (options) {if(options.data && options.data.length>0){for (let i = 0; i < options.data.length; i++) {options.data[i].fileName=options.files[i].fileMeta.fileName;options.data[i].fileSize=options.files[i].fileMeta.fileSize;}}return {data: options.data,errors: options.errors,abort: false,newErrorsAndRetryData: []}}',
      options: {scriptFunctionStub: 'preSavePage', file: 'json'},
      formKey: 34,
      isLoggable: true,
      mode: 'json',
      required: false,
      isValid: true,
      label: 'Edit content',
    };

    initDynaScriptContent(data);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledWith(actions.resource.request('scripts', '638538b6c7d76c583e7593da'));
  });

  test('mock on field change should be called when content is uppdated in the empty script', () => {
    mutateStore(initialStore, draft => {
      draft.session.stage = {
        new638538b6c7d76c583e7593da: {
          master: null,
          patch: [
            {
              op: 'replace',
              path: '/_id',
              value: 'new-uwmt5Mi92',
              timestamp: 1657615760352,
            },
          ],
        },
      };
      draft.data.resources.scripts = [{
        _id: 'new638538b6c7d76c583e7593da',
        data: 'somedata',
        lastModified: '2022-03-29T10:32:37.093Z',
        createdAt: '2022-03-29T10:32:36.916Z',
        name: 'Snowflake Data Warehouse Script [v1.1.1]',
        description: 'Used by Snowflake Data Warehouse template',
        _sourceId: '611f3c33e3488c6cb37b8bd1',
      }];
    });
    const data =
    {id: 'content',
      onFieldChange: mockOnFieldChange,
      resourceId: 'new638538b6c7d76c583e7593da',
      value: 'function preSavePage (options) {return "sometext";}',
      options: {scriptFunctionStub: 'preSavePage', file: 'json'},
      formKey: 34,
      isLoggable: true,
      mode: 'json',
      required: false,
      isValid: true,
      label: 'Edit content',

    };

    initDynaScriptContent(data);
    const textBoxNode = screen.getAllByRole('textbox').find(eachOption => eachOption.getAttribute('data-test') === 'code-editor');

    expect(textBoxNode).toBeInTheDocument();
    expect(document.querySelector('textarea[data-test="code-editor"]')).toHaveTextContent('function preSavePage (options) {return "sometext";}');
    expect(mockOnFieldChange).toHaveBeenCalledWith('content', '', true);
    const updatedScriptContent =
        `function preSavePage (options) {return "sometext";}${scriptHookStubs.preSavePage}`;

    expect(mockOnFieldChange).toHaveBeenCalledWith('content', updatedScriptContent, true);
  });
});
