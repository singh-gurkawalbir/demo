import React from 'react';
import {render, screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {renderWithProviders} from '../../../../../../../test/test-utils';
import SourceDataType from './SourceDataType';
import actions from '../../../../../../../actions';

let anchorEl = null;
const setAnchorEl = jest.fn(a => {
  anchorEl = a;
});

const mockDispatch = jest.fn();
const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  __esModule: true,
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
    location: {pathname: 'initialpath'},
  }),
}));

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

function initFunction(props, renderFun = render) {
  const ui = (
    <MemoryRouter><SourceDataType {...props} /></MemoryRouter>
  );
  const {utils} = renderWithProviders(ui, {renderFun});

  return {utils};
}

describe('source Data type Ui test cases', () => {
  test('should show empty dom element when dynamic lookup is true', () => {
    const props = {
      isDynamicLookup: true,
      anchorEl,
      setAnchorEl,
    };
    const {utils} = initFunction(props);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should change the Source Data type to number', async () => {
    const props = {
      nodeKey: 'someNodeKey',
      anchorEl,
      setAnchorEl,
    };
    const {utils} = initFunction(props);

    await userEvent.click(screen.getByRole('button'));
    expect(setAnchorEl).toHaveBeenCalledTimes(1);
    const props2 = {
      nodeKey: 'someNodeKey',
      anchorEl,
      setAnchorEl,
    };

    initFunction(props2, utils.rerender);
    await userEvent.click(screen.getByText('number'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.updateDataType('someNodeKey', 'number', true)
    );
  });
  test('should update active key (via dispatch call) and call history push to rediect', async () => {
    anchorEl = null;
    const props = {
      nodeKey: 'someNodeKey', sourceDataTypes: ['string', 'number'], anchorEl, setAnchorEl,
    };

    initFunction(props);

    expect(screen.getByText('string,number')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.mapping.v2.updateActiveKey('someNodeKey')
    );
    expect(mockHistoryPush).toHaveBeenCalledWith('initialpath/settings/v2/someNodeKey/:generate');
  });
  test('should verify the presense of tootip title for handle bar', () => {
    anchorEl = null;
    const props = {
      nodeKey: 'someNodeKey', isHandlebarExp: true, sourceDataTypes: ['string', 'number'], anchorEl, setAnchorEl,
    };

    initFunction(props);

    expect(screen.getByText('string,number')).toBeInTheDocument();
    expect(screen.getByLabelText('The data type of handlebars expressions is auto-set to "string" and cannot be changed.')).toBeInTheDocument();
  });
  test('should verify the presense of tootip title for hardcoded', () => {
    anchorEl = null;
    const props = {
      nodeKey: 'someNodeKey', isHardCodedValue: true, sourceDataTypes: ['string', 'number'], anchorEl, setAnchorEl,
    };

    initFunction(props);

    expect(screen.getByText('string,number')).toBeInTheDocument();
    expect(screen.getByLabelText('The data type of hard-coded values is auto-set to "string" and cannot be changed.')).toBeInTheDocument();
  });
});
