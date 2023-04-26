
import React from 'react';
import { screen } from '@testing-library/react';
import * as reactRedux from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import PageGeneratorNode from './PgNode';
import { renderWithProviders } from '../../../../test/test-utils';
import * as mockContext from '../Context';
import { getCreatedStore } from '../../../../store';
import actions from '../../../../actions';

let initialStore;

function initPageGeneratorNode({props}) {
  const ui = (
    <MemoryRouter>
      <PageGeneratorNode props={props} />
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('./Handles/DefaultHandle', () => ({
  __esModule: true,
  ...jest.requireActual('./Handles/DefaultHandle'),
  default: props => (
    <div>
      <div>Mock DefaultHandle {props.type} {props.position}</div>
    </div>
  ),
}));
jest.mock('../../PageGenerator', () => ({
  __esModule: true,
  ...jest.requireActual('../../PageGenerator'),
  default: props => (
    <div>
      <button type="button" data-test="delete" onClick={() => props.onDelete('Deleting..')}>
        Delete
      </button>
    </div>
  ),
}));

describe('Testsuite for PageGeneratorNode', () => {
  let mockDispatchFn;
  let useDispatchSpy;

  beforeEach(() => {
    initialStore = getCreatedStore();
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
    mockDispatchFn.mockClear();
  });
  test('should test the delete option on the page generator node', async () => {
    jest.spyOn(mockContext, 'useFlowContext').mockReturnValue({
      flow: {_integrationId: '345'}, flowId: '234',
    });
    initPageGeneratorNode({
      props: {
        data: {
          hideDelete: false,
          path: '/pageGenerators/0',
          _exportId: '123',
        },
      },
    });
    expect(screen.getByText(/mock defaulthandle source right/i)).toBeInTheDocument();
    const deleteButton = screen.getByRole('button', {
      name: /delete/i,
    });

    expect(deleteButton).toBeInTheDocument();
    await userEvent.click(deleteButton);
    expect(mockDispatchFn).toHaveBeenCalledWith(actions.flow.deleteStep('234', 'Deleting..'));
  });
});
