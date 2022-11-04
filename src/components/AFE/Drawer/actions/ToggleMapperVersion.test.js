/* eslint-disable no-undef */
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import actions from '../../../../actions';
import { getCreatedStore } from '../../../../store';
import { renderWithProviders } from '../../../../test/test-utils';
import ToggleMapperVersion from './ToggleMapperVersion';

let initialStore;

async function initToggleMapperVersion({ editorId, version, adaptorType, saveStatus }) {
  initialStore.getState().session.editors = {
    '25bc3': {
      saveStatus,
    },
  };
  initialStore.getState().session.mapping = {
    mapping: {
      version,
      importId: '26ab1',
    },
  };
  initialStore.getState().data.resources = {
    imports: [
      {
        _id: '26ab1',
        adaptorType,
      },
    ],
  };
  const ui = (
    <MemoryRouter>
      <ToggleMapperVersion editorId={editorId} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, { initialStore });
}

describe('test suite for ToggleMapperVersion', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
    useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
    mockDispatchFn = jest.fn(action => {
      switch (action.type) {
        default:
          initialStore.dispatch(action);
      }
    });
    useDispatchSpy.mockReturnValue(mockDispatchFn);
  });

  afterEach(() => {
    useDispatchSpy.mockClear();
    mockDispatchFn.mockClear();
  });

  test('Should render ToggleMapperVersion', async () => {
    await initToggleMapperVersion({
      editorId: '25bc3', version: '1', adaptorType: 'HTTPImport', saveStatus: true,
    });
    expect(screen.getByRole('button', {
      name: /mapper 1\.0/i,
    })).toBeInTheDocument();
    expect(screen.getByRole('button', {
      name: /mapper 2\.0/i,
    })).toBeInTheDocument();
    screen.debug(null, Infinity);
  });
  test('Toggling ToggleMapperVersion and checking the functionality', async () => {
    await initToggleMapperVersion({
      editorId: '25bc3', version: '1', adaptorType: 'HTTPImport', saveStatus: true,
    });
    const afeButton = screen.getByRole('button', {
      name: /mapper 2\.0/i,
    });

    userEvent.click(afeButton);
    await expect(mockDispatchFn).toBeCalledWith(actions.mapping.toggleVersion(2));
  });
  test('Should render null when showToggle is false', async () => {
    const { utils } = await initToggleMapperVersion({
      editorId: '25bc3', version: '1', adaptorType: 'HTTPExport', saveStatus: true,
    });

    expect(utils.container).toBeEmptyDOMElement();
  });
});
