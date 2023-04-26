import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import actions from '../../../../actions';
import DynaSelectAliasResource from './DynaSelectAliasResource';
import {mutateStore, renderWithProviders} from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';
import errorMessageStore from '../../../../utils/errorStore';
import { message } from '../../../../utils/messageStore';
import { MODEL_PLURAL_TO_LABEL } from '../../../../utils/resource';

const initialStore = getCreatedStore();

jest.mock('react-truncate-markup', () => ({
  __esModule: true,
  ...jest.requireActual('react-truncate-markup'),
  default: props => {
    if (props.children.length > props.lines) { props.onTruncate(true); }

    return (
      <span
        width="100%">
        <span />
        <div>
          {props.children}
        </div>
      </span>
    );
  },
}));

function initDynaSelect(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.asyncTask = {'integration-alias': props.status};
    draft.session.form = {'integration-alias': {
      value: {
        aliasResourceType: props.aliasResourceType,
      },
    }};
    draft.data.resources = {
      integrations: [
        {
          _id: '63368c92bb74b66e32ab05ee',
          aliases: [
            {
              alias: 'test',
              _connectionId: '63368ce9bb74b66e32ab060c',
            },
          ],
          _registeredConnectionIds: ['63368c92bb74b66e32ab05aa', '63368c92bb74b66e32ab05bb', '63368c92bb74b66e32ab05cc'],
        },
      ],
      flows: [
        {
          _id: '53368c92bb74b66e32ab05ee',
          _integrationId: '63368c92bb74b66e32ab05ee',
          name: 'flow1',
        },
        {
          _id: '54368c92bb74b66e32ab05ee',
          _integrationId: '63368c92bb74b66e32ab05ee',
          name: 'flow2',
        },
        {
          _id: '55368c92bb74b66e32ab05ee',
          _integrationId: '63368c92bb74b66e32ab05ee',
          name: 'flow3',
        },
        {
          _id: '55368c92bb74b66e32ab05ef',
          _integrationId: '63368c92bb74b66e32ab05e1',
          name: 'flow4',
        },
      ],
      imports: [
        {
          _id: '43368c92bb74b66e32ab05ee',
          _connectionId: '63368c92bb74b66e32ab05aa',
          name: 'import1',
        },
        {
          _id: '44368c92bb74b66e32ab05ee',
          _connectionId: '63368c92bb74b66e32ab05bb',
          name: 'import2',
        },
        {
          _id: '45368c92bb74b66e32ab05ee',
          _connectionId: '63368c92bb74b66e32ab05cc',
          name: 'import3',
        },
        {
          _id: '45368c92bb64b66e32ab05ee',
          _connectionId: '63368c92bb74b66e33ab05cc',
          name: 'import4',
        },
      ],
      exports: [
        {
          _id: '73368c92bb74b66e32ab05ee',
          _connectionId: '63368c92bb74b66e32ab05aa',
          name: 'export1',
        },
        {
          _id: '74368c92bb74b66e32ab05ee',
          _connectionId: '63368c92bb74b66e32ab05bb',
          name: 'export2',
        },
        {
          _id: '75368c92bb74b66e32ab05ee',
          _connectionId: '63368c92bb74b66e32ab05cc',
          name: 'export3',
        },
        {
          _id: '75369c92bb74b66e32ab05ee',
          _conenctionId: '63368c92bb74b66e32ab06cc',
          name: 'export4',
        },
      ],
      connections: [
        {
          _id: '63368c92bb74b66e32ab05aa',
          name: 'connection1',
        },
        {
          _id: '63368c92bb74b66e32ab05bb',
          name: 'connection2',
        },
        {
          _id: '63368c92bb74b66e32ab05cc',
          name: 'connection3',
        },
        {
          _id: '63368c92bc74b66e32ab05cc',
          name: 'connection4',
        },
      ],
    };
  });

  return renderWithProviders(<DynaSelectAliasResource {...props} />, {initialStore});
}
describe('dynaAliasId UI tests', () => {
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
  const props = {
    id: 'aliasId',
    aliasResourceType: 'flows',
    aliasContextResourceId: '63368c92bb74b66e32ab05ee',
    aliasContextResourceType: 'integrations',
    formKey: 'integration-alias',
    value: 'test',
  };

  test('should display all the valid flows when the aliasResourceType is "flows" and when clicked on the resource dropdown', async () => {
    initDynaSelect(props);
    const dropBox = screen.getByRole('button');

    expect(dropBox).toBeInTheDocument();
    await userEvent.click(dropBox);

    const menuitems = screen.getAllByRole('menuitem').map(opt => opt.textContent);

    expect(menuitems).toEqual(['Please select', 'flow1', 'flow2', 'flow3']);
  });
  test('should only display the flows belonging to the integration in the above case', async () => {
    initDynaSelect(props);
    const dropBox = document.querySelector('[aria-haspopup="listbox"]');

    expect(dropBox).toBeInTheDocument();
    await userEvent.click(dropBox);
    expect(screen.getByText('flow1')).toBeInTheDocument();
    expect(screen.getByText('flow2')).toBeInTheDocument();
    expect(screen.getByText('flow3')).toBeInTheDocument();

    expect(screen.queryByText('flow4')).toBeNull();     // flow4 belongs to a different integration hence should not be shown //
  });
  test('should display the registered connectionIds of the integration passed when aliasResourceType is selected as "connections"', async () => {
    initDynaSelect({...props, aliasResourceType: 'connections'});
    const dropBox = document.querySelector('[aria-haspopup="listbox"]');

    expect(dropBox).toBeInTheDocument();
    await userEvent.click(dropBox);
    expect(screen.getByText('connection1')).toBeInTheDocument();
    expect(screen.getByText('connection2')).toBeInTheDocument();
    expect(screen.getByText('connection3')).toBeInTheDocument();

    expect(screen.queryByText('connection4')).toBeNull();     // connection4 is not registered with the passed integration hence should not be shown //
  });
  test('should display the imports belonging to the integration passed when aliasResourceType is selected as "imports"', async () => {
    initDynaSelect({...props, aliasResourceType: 'imports'});
    const dropBox = screen.getByRole('button');

    expect(dropBox).toBeInTheDocument();
    await userEvent.click(dropBox);
    expect(screen.getByText('import1')).toBeInTheDocument();
    expect(screen.getByText('import2')).toBeInTheDocument();
    expect(screen.getByText('import3')).toBeInTheDocument();

    expect(screen.queryByText('import4')).toBeNull();     // import4 is not registered with the passed integration hence should not be shown //
  });
  test('should display the imports belonging to the integration passed when aliasResourceType is selected as "exports"', async () => {
    initDynaSelect({...props, aliasResourceType: 'exports'});
    const dropBox = screen.getByRole('button');

    expect(dropBox).toBeInTheDocument();
    await userEvent.click(dropBox);
    expect(screen.getByText('export1')).toBeInTheDocument();
    expect(screen.getByText('export2')).toBeInTheDocument();
    expect(screen.getByText('export3')).toBeInTheDocument();

    expect(screen.queryByText('export4')).toBeNull();     // export4 is not registered with the passed integration hence should not be shown //
  });
  test('should make a dispatch call with an error message when no resource is available for the selected resourceType', async () => {
    initDynaSelect({...props, value: undefined, aliasResourceType: 'scripts'});
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('integration-alias')('aliasId', {
      isValid: false,
      errorMessages: errorMessageStore('NO_ALIAS_RESOURCE_MESSAGE', {
        label: MODEL_PLURAL_TO_LABEL.scripts.toLowerCase(),
        resourceType: 'scripts',
      }),
    })));
  });
  test('should make a dispatch call with an error message when no resource is selected for the passed resourceType', async () => {
    initDynaSelect({...props, value: undefined, aliasResourceType: 'flows'});
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.forceFieldState('integration-alias')('aliasId', {
      isValid: false,
      errorMessages: message.REQUIRED_MESSAGE,
    })));
  });
});
