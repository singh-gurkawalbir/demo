/* global describe, test, expect,beforeEach,afterEach, jest */
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';
import DynaFileDefinitionSelect from './DynaFileDefinitionSelect';
import actions from '../../../actions';

const onFieldChange = jest.fn();

async function initDynaFileDefinitionSelect(props, status) {
  const initialStore = reduxStore;

  initialStore.getState().data.fileDefinitions = {
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

  return renderWithProviders(<DynaFileDefinitionSelect {...props} />, {initialStore});
}

describe('DynaFileDefinitionSelect tests', () => {
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
  test('Should able to test DynaFileDefinitionSelect with status as requested', async () => {
    const props = {format: 'edi', onFieldChange};

    await initDynaFileDefinitionSelect(props, 'requested');
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
  test('Should able to test DynaFileDefinitionSelect with status as received having template', async () => {
    const props = {format: 'edi', onFieldChange};

    await initDynaFileDefinitionSelect(props, 'received');
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('menuitem', {name: 'Amazon VC 850'})).toBeInTheDocument();
    expect(screen.getByText('Amazon Vendor Central')).toBeInTheDocument();
    userEvent.click(screen.getByRole('menuitem', {name: 'Amazon VC 850'}));
    expect(mockDispatchFn).not.toHaveBeenCalledWith(actions.fileDefinitions.definition.preBuilt.request('edi', 'amazonedi850'));
  });
  test('Should able to test DynaFileDefinitionSelect without having template', async () => {
    const props = {format: 'fixed', onFieldChange};

    await initDynaFileDefinitionSelect(props, 'received');
    userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('menuitem', {name: 'Amazon VC 754'})).toBeInTheDocument();
    expect(screen.getByText('V3')).toBeInTheDocument();
    userEvent.click(screen.getByRole('menuitem', {name: 'Amazon VC 754'}));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.fileDefinitions.definition.preBuilt.request('fixed', 'amazonedi754'));
  });
  test('Should able to test DynaFileDefinitionSelect without any filedefinitionselect and invalid status', async () => {
    const props = {format: 'edix12', onFieldChange};

    await initDynaFileDefinitionSelect(props);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.fileDefinitions.preBuilt.request());
  });
});
