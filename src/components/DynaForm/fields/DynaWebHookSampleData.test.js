
import React from 'react';
import {screen, fireEvent} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynaWebHookSampleData from './DynaWebHookSampleData';
import { renderWithProviders, reduxStore} from '../../../test/test-utils';
import actions from '../../../actions';
import * as mockEnqueSnackbar from '../../../hooks/enqueueSnackbar';

const enqueueSnackbar = jest.fn();

jest.mock('../../icons/EditIcon', () => ({
  __esModule: true,
  ...jest.requireActual('../../icons/EditIcon'),
  default: () => (
    <div>EditIcon</div>
  ),
}));

const mockDispatch = jest.fn();

jest.mock('react-redux', () => ({
  __esModule: true,
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

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
    const handleChange = event => {
      props.onChange(event?.currentTarget?.value);
    };

    return (
      <>
        <textarea name="codeEditor" data-test="code-editor" value={value} onChange={handleChange} />
      </>
    );
  },
}
));

const initialStore = reduxStore;

initialStore.getState().data.resources.exports = [{
  _id: 'someresourceId',
  sampleData: {sample: 'sampleData'},
}];

function initDynaWebHookSampleData(props = {}) {
  const ui = (
    <DynaWebHookSampleData
      {...props}
    />
  );

  return renderWithProviders(ui);
}
const mockOnFieldChange = jest.fn();

describe('dynaWebHookSampleData UI test cases', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(mockEnqueSnackbar, 'default').mockReturnValue([enqueueSnackbar]);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should show the message "Webhook url is mandatory"', async () => {
    initDynaWebHookSampleData(
      {label: 'PropsLabel', value: 'PropsValue', id: 'SomeId', options: {}, onFieldChange: mockOnFieldChange }
    );

    await userEvent.click(screen.getByText('Click to show'));
    expect(enqueueSnackbar).toHaveBeenCalledWith({message: 'Webhook url is mandatory.', variant: 'error'});
  });
  test('should make resource request dispatch call when clicked on "Click to show" button', async () => {
    initDynaWebHookSampleData(
      {label: 'PropsLabel', value: 'PropsValue', id: 'SomeId', resourceId: 'someresourceId', options: {webHookUrl: '/webHookUrl'}, onFieldChange: mockOnFieldChange }
    );
    await userEvent.click(screen.getByText('Click to show'));
    expect(mockDispatch).toHaveBeenCalledWith(
      actions.resource.request('exports', 'someresourceId')
    );
  });

  test('should enter a string in the field textbox', () => {
    initDynaWebHookSampleData(
      {label: 'PropsLabel', value: 'PropsValue', id: 'SomeId', resourceId: 'someresourceId', options: {webHookUrl: '/webHookUrl'}, onFieldChange: mockOnFieldChange }
    );
    const textBoxNode = screen.getByRole('textbox');

    expect(textBoxNode).toBeInTheDocument();
    fireEvent.change(textBoxNode, {target: {value: 'sample string'}});
    expect(mockOnFieldChange).toHaveBeenCalledWith('SomeId', 'sample string');
  });
  test('should enter an object in the field textbox', () => {
    renderWithProviders(
      <DynaWebHookSampleData
        label="PropsLabel"
        value="PropsValue"
        id="SomeId"
        resourceId="someresourceId"
        options={{webHookUrl: '/webHookUrl'}}
        onFieldChange={mockOnFieldChange}
        />, {initialStore});
    expect(mockOnFieldChange).toHaveBeenCalledWith('SomeId', {sample: 'sampleData'}, true);

    const textBoxNode = screen.getByRole('textbox');

    expect(textBoxNode).toBeInTheDocument();
    fireEvent.change(textBoxNode, {target: {value: '{"id":"123"}'}});
    expect(mockOnFieldChange).toHaveBeenCalledWith('SomeId', { id: '123' });
  });
});
