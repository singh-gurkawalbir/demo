
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import DynaFileDefinitionSelect from './DynaFileDefinitionSelect';
import actions from '../../../actions';

const onFieldChange = jest.fn();

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

async function initDynaFileDefinitionSelect(props, status) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data.fileDefinitions = {
      preBuiltFileDefinitions: {
        data: {
          edi: [
            { subHeader: 'Amazon Vendor Central' },
            {
              format: 'delimited',
              label: 'Amazon VC 850',
              value: 'amazonedi850',
              vendor: 'Amazon Vendor Central',
              template: { generate: {}, parse: {} },
            },
          ],
          fixed: [
            {
              subHeader: 'V3',
            },
            {
              format: 'fixed',
              label: 'Amazon VC 754',
              value: 'amazonedi754',
              vendor: 'V3',
            },
          ],
        },
        status,
      },
    };
  });

  return renderWithProviders(<DynaFileDefinitionSelect {...props} />, {initialStore});
}

describe('dynaFileDefinitionSelect tests', () => {
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
    onFieldChange.mockClear();
  });
  test('should able to test DynaFileDefinitionSelect with status as requested', async () => {
    const props = {format: 'edi', onFieldChange};

    await initDynaFileDefinitionSelect(props, 'requested');
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('should able to test DynaFileDefinitionSelect with status as received having template', async () => {
    const props = {format: 'edi', onFieldChange};

    await initDynaFileDefinitionSelect(props, 'received');
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('menuitem', {name: 'Amazon VC 850'})).toBeInTheDocument();
    expect(screen.getByText('Amazon Vendor Central')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('menuitem', {name: 'Amazon VC 850'}));
    expect(mockDispatchFn).not.toHaveBeenCalledWith(actions.fileDefinitions.definition.preBuilt.request('edi', 'amazonedi850'));
  });
  test('should able to test DynaFileDefinitionSelect without having template', async () => {
    const props = {format: 'fixed', onFieldChange};

    await initDynaFileDefinitionSelect(props, 'received');
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('menuitem', {name: 'Amazon VC 754'})).toBeInTheDocument();
    expect(screen.getByText('V3')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('menuitem', {name: 'Amazon VC 754'}));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.fileDefinitions.definition.preBuilt.request('fixed', 'amazonedi754'));
  });
  test('should able to test DynaFileDefinitionSelect without any filedefinitionselect and invalid status', async () => {
    const props = {format: 'edix12', onFieldChange};

    await initDynaFileDefinitionSelect(props);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.fileDefinitions.preBuilt.request());
  });
});
