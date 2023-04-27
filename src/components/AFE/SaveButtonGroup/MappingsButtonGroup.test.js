import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import { renderWithProviders, reduxStore, mutateStore } from '../../../test/test-utils';
import ButtonWrapper from './MappingsButtonGroup';
import actions from '../../../actions';

const mockClose = jest.fn();

async function initButtonWrapper(props = {editorId: 'responseMappings', onClose: mockClose}, saveStatus, validationErrMsg) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.session.editors = {
      responseMappings: {
        editorType: 'responseMappings',
      },
      mappings: {
        editorType: 'mappings',
      },
    };
    draft.session.responseMapping = {
      mapping: {
        mappings: [
          {generate: 'a', extract: 'b', key: 'k1'},
        ],
        mappingsCopy: [
          {generate: 'c', extract: 'd', key: 'k5'},
          {generate: 'e', extract: 'f', key: 'k6'},
        ],
        saveStatus,
      },
    };
    draft.session.mapping = {
      mapping: {
        mappings: [
          {generate: 'a', extract: 'b', key: 'k1'},
        ],
        mappingsCopy: [
          {generate: 'e', extract: 'f', key: 'k2'},
        ],
        saveStatus,
        validationErrMsg,
      },
    };
  });

  return renderWithProviders(<MemoryRouter><ButtonWrapper {...props} /></MemoryRouter>, { initialStore });
}
describe('buttonWrapper tests', () => {
  const useDispatchSpy = jest.spyOn(reactRedux, 'useDispatch');
  const mockDispatchFn = jest.fn();

  useDispatchSpy.mockReturnValue(mockDispatchFn);
  afterEach(() => {
    mockDispatchFn.mockClear();
  });
  test('should able to test ButtonWrapper when editorType is responseMappings', async () => {
    await initButtonWrapper();
    expect(screen.getByRole('button', {name: 'Save'})).toBeEnabled();
    expect(screen.getByRole('button', {name: 'Close'})).toBeEnabled();
    await userEvent.click(screen.getByRole('button', {name: 'Save & close'}));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.responseMapping.save({match: {isExact: true, params: {}, path: '/', url: '/'}}));
  });

  test('should able to test ButtonWrapper when editorType is responseMappings and saveInProgress true', async () => {
    await initButtonWrapper({editorId: 'responseMappings'}, 'requested');
    expect(screen.getByRole('button', {name: 'Saving...'})).toBeInTheDocument();
  });
  test('should able to test ButtonWrapper when editorType is mappings without validationError', async () => {
    await initButtonWrapper({editorId: 'mappings'});
    expect(screen.getByRole('button', {name: 'Save'})).toBeEnabled();
    await userEvent.click(screen.getByRole('button', {name: 'Save & close'}));
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.mapping.save({match: {isExact: true, params: {}, path: '/', url: '/'}}));
  });
  test('should able to test ButtonWrapper when editorType is mappings with validationError', async () => {
    await initButtonWrapper({editorId: 'mappings', onClose: mockClose}, 'completed', 'Some genuine mapping error');
    expect(screen.getByRole('button', {name: 'Save & close'})).toBeEnabled();
    await userEvent.click(screen.getByRole('button', {name: 'Save'}));
    expect(screen.getByText('Some genuine mapping error')).toBeInTheDocument();
  });
});

