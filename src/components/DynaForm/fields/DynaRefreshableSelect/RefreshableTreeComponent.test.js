import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as reactRedux from 'react-redux';
import actions from '../../../../actions';
import RefreshableTreeComponent from './RefreshableTreeComponent';
import {mutateStore, renderWithProviders} from '../../../../test/test-utils';
import { getCreatedStore } from '../../../../store';

const initialStore = getCreatedStore();

jest.mock('@mui/lab/TreeView', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/lab/TreeView'),
  default: props => <div>{props.children}<button type="button" onClick={() => props.onNodeToggle('click', ['newReference,newone,"parent2,ref1"'])}>Node</button></div>,
}));

jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  Spinner: () => <div>Spinner</div>,
}));

function initRefreshableTreeComponent(props = {}) {
  mutateStore(initialStore, draft => {
    draft.session.metadata = {application: {'5efd8663a56953365bd28541': {
      'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote': {
        data: {
          fields:
          [
            {label: 'label1', referenceTo: ['ref1', 'ref2', 'ref3'], relationshipName: 'parent'},
            {label: 'label2', referenceTo: ['ref11', 'ref22', 'ref33'], relationshipName: 'parent1'},
            {label: 'label3', referenceTo: ['ref111', 'ref222', 'ref333'], relationshipName: 'parent2'},
            {label: 'label4', relationshipName: 'parent3'},
            {label: 'label5', relationshipName: 'parent4'},
            {label: 'label6', relationshipName: 'parent5'},
          ],
        },
        status: props.status,
      },
      'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/newone': {
        status: 'requested',
      },
    },
    },
    };
  });

  return renderWithProviders(<RefreshableTreeComponent {...props} />, {initialStore});
}

describe('RefreshableTreeComponent UI tests', () => {
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
    connectionId: '5efd8663a56953365bd28541',
    selectedReferenceTo: 'Quote',
    selectedRelationshipName: 'relation',
    setSelectedValues: jest.fn(),
    status: 'received',
    selectedValues: [{id: 'id1', label: 'label1'}, {id: 'id2', label: 'label2'}],
  };

  test('should pass the initial render', () => {
    initRefreshableTreeComponent(props);
    expect(screen.getByText('label4')).toBeInTheDocument();
    expect(screen.getByText('label5')).toBeInTheDocument();
    expect(screen.getByText('label6')).toBeInTheDocument();
    const checkboxes = screen.getAllByRole('checkbox');
    const treeitems = screen.getAllByRole('treeitem');

    expect(checkboxes).toHaveLength(3);
    expect(treeitems).toHaveLength(3);
  });
  test('should make a dispatch call on initial renderwhen data status is not equal to "received"', async () => {
    initRefreshableTreeComponent({...props, status: 'requested'});
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.metadata.refresh(
      '5efd8663a56953365bd28541',
      'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/Quote', {refreshCache: true}
    )));
  });
  test('should make a dispatch when "toggleOpenNodeStatus" is not equal to "requested"', async () => {
    initRefreshableTreeComponent({...props, nodeId: 'newone', status: 'received'});
    const checkboxes = screen.getAllByRole('checkbox');

    await userEvent.click(checkboxes[0]);
    expect(screen.getByText('Node')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Node'));
    await waitFor(() => expect(mockDispatchFn).toBeCalledWith(actions.metadata.refresh(
      '5efd8663a56953365bd28541',
      'salesforce/metadata/connections/5efd8663a56953365bd28541/sObjectTypes/newone', {refreshCache: true}
    )));
  });
  test('should render a loading spinner when tree data status is refreshed', () => {
    initRefreshableTreeComponent({...props, status: 'refreshed'});
    expect(screen.getByText('Spinner')).toBeInTheDocument();
  });
});

