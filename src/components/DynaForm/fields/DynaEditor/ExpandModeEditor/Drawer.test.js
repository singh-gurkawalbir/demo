
import React from 'react';
import { screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route } from 'react-router-dom';
import * as reactRedux from 'react-redux';
import {mutateStore, renderWithProviders} from '../../../../../test/test-utils';
import ExpandModeDrawer from './Drawer';
import { getCreatedStore } from '../../../../../store';
import { DrawerProvider } from '../../../../drawer/Right/DrawerContext';
import actions from '../../../../../actions';

const initialStore = getCreatedStore();

const editorValue = 'function getOrdnsReqData (options) {\n  \nvar packageLines = [];\nvar itemLines = [];\nvar packageLine;\nvar itemLIne;\nvar itemLine;\nvar hirerachyLevelCode;\nvar marksAndNumbers\nvar hierarchicalIDNumber;\nvar hierarchicalParentIDNumber;\nvar item;\nvar Quantity\n\n\nvar len = options.data[0].transactionSets[0].HL_loop.length;\n\n\nfor (var i = 0; i < len; i++) {\n  hirerachyLevelCode = options.data[0].transactionSets[0].HL_loop[i].hierarchicalLevel[0].hierarchicalLevelCode\n\n  if (hirerachyLevelCode === "P") {\n  {\n    hierarchicalIDNumber = options.data[0].transactionSets[0].HL_loop[i].hierarchicalLevel[0].hierarchicalIDNumber,\n    marksAndNumbers = options.data[0].transactionSets[0].HL_loop[i].marksAndNumbersInformation[0].marksAndNumbers\n}\npackageLine = {\n  "hierarchicalIDNumber": hierarchicalIDNumber,\n  "marksAndNumbers": marksAndNumbers\n}\npackageLines.push(packageLine)\n}\n\nelse if (hirerachyLevelCode === "I") {\n  {\n    hierarchicalParentIDNumber = options.data[0].transactionSets[0].HL_loop[i].hierarchicalLevel[0].hierarchicalParentIDNumber,\n        item = options.data[0].transactionSets[0].HL_loop[i].itemIdentification[0].productServiceID,\n    Quantity = options.data[0].transactionSets[0].HL_loop[i].itemDetailShipment[0].numberOfUnitsShipped\n}\nitemLine = {\n  "hierarchicalParentIDNumber": hierarchicalParentIDNumber,\n  "item": item,\n  "Quantity": Quantity\n}\nconsole.debug("itemLIne is ", JSON.stringify(itemLine))\nitemLines.push(itemLine)\n}\n\nvar reqData = {\n  "packageLinesArray": packageLines,\n    "itemLinesArray": itemLines,\n\n  \n}\n}\nreturn (\n  reqData\n  )\n  \n}';

function initExpandModeDrawer(resourceId = '62fb62165ac68227ae0974ad') {
  mutateStore(initialStore, draft => {
    draft.session.form = {
      'scripts-62fb62165ac68227ae0974ad': {
        fields: {
          content: {
            resourceId,
            resourceType: 'scripts',
            isLoggable: true,
            value: editorValue,
            disabled: false,
          },
        },
      },
    };
  });
  const ui = (
    <MemoryRouter initialEntries={[{pathname: '/expand/scripts-62fb62165ac68227ae0974ad/content'}]}>
      <Route path="/expand/:formKey/:fieldId">
        <DrawerProvider>
          <ExpandModeDrawer />
        </DrawerProvider>
      </Route>
    </MemoryRouter>
  );

  return renderWithProviders(ui, {initialStore});
}

jest.mock('../../../../drawer/Right', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../drawer/Right'),
  default: props => (
    <>
      {props.children}
    </>
  ),
}));

const mockHistoryGoBack = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    goBack: mockHistoryGoBack,
  }),
}));

jest.mock('../../../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupAuto', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../SaveAndCloseButtonGroup/SaveAndCloseButtonGroupAuto'),
  default: props => (
    <>
      <button type="button" onClick={props.onSave}>Save</button>
      <button type="button" onClick={props.onClose}>Close</button>
    </>
  ),
}));

jest.mock('@celigo/fuse-ui', () => ({
  __esModule: true,
  ...jest.requireActual('@celigo/fuse-ui'),
  FilledButton: props => <button type="button" onClick={props.onClick}>Done</button>,
  TextButton: props => <button type="button" onClick={props.onClick}>Cancel</button>,
}));

describe('expandModeDrawer UI tests', () => {
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
  test('should render save and close button group for existing resources and make a dispatch call on save and redirection on Close', async () => {
    const patchSet = [{ op: 'replace', path: '/content', value: editorValue}];

    initExpandModeDrawer();
    expect(screen.getByText('Edit content')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(screen.getByText('Close')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Save'));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.resource.patchAndCommitStaged('scripts', '62fb62165ac68227ae0974ad', patchSet)));
    await userEvent.click(screen.getByText('Close'));
    await waitFor(() => expect(mockHistoryGoBack).toHaveBeenCalled());
  });
  test('should render the done and cancel buttons for newly formed resource and should make a dispatch call and redirection when clicked on "Done"', async () => {
    initExpandModeDrawer('new-resourceId');
    expect(screen.getByText('Edit content')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Done'));
    await waitFor(() => expect(mockDispatchFn).toHaveBeenCalledWith(actions.form.fieldChange('scripts-62fb62165ac68227ae0974ad')('content', editorValue)));
    await waitFor(() => expect(mockHistoryGoBack).toHaveBeenCalled());
  });
});
