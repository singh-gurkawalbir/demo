
import React from 'react';
import {
  screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {MemoryRouter} from 'react-router-dom';
import Suggestions from './Suggestions';
import { getCreatedStore } from '../../../../store';
import { mutateStore, renderWithProviders } from '../../../../test/test-utils';

const initialStore = getCreatedStore();

jest.mock('../../../../hooks/useEnableButtonOnTouchedForm', () => ({
  __esModule: true,
  ...jest.requireActual('../../../../hooks/useEnableButtonOnTouchedForm'),
  default: props => ({formTouched: true, onClickWhenValid: props.onClick}),
}));

function initSuggestions(props = {}) {
  mutateStore(initialStore, draft => {
    draft.data.resources = {
      imports: [{
        _id: '6a3c75dd5d3c125c88b5dd20',
        _connectionId: '5q3c75dd5d3c125c88b5dd20',
        name: 'import1',
        adaptorType: 'HTTPImport',
      }],
      flows: [{
        _id: '5b3c75dd5d3c125c88b5dd20',
        name: 'flow name 1',
        _connectionId: '5b3c75dd5d3c125c88b5dd31',
      }],
    };
    draft.session.flowData = {'5b3c75dd5d3c125c88b5dd20': {pageProcessorsMap: {'6a3c75dd5d3c125c88b5dd20': {processedFlowInput: {data:
     {
       record: {
         id: 123,
         name: 'Bob',
         age: 33,
       },
     },
    }}}}};
  });

  return renderWithProviders(
    <MemoryRouter>
      <Suggestions {...props} />
    </MemoryRouter>,
    {initialStore});
}
// : 'processedFlowInput',

describe('suggestions UI tests', () => {
  const mockonValueUpdate = jest.fn();
  const mockonFieldChange = jest.fn();

  const props = {
    id: 'testId',
    flowId: '5b3c75dd5d3c125c88b5dd20',
    resourceId: '6a3c75dd5d3c125c88b5dd20',
    resourceType: 'imports',
    stage: 'inputFilter',
    showExtract: true,
    hide: false,
    formContext: {
      fields: [{
        id: 'http.lookups',
        value: [{name: 'value1'}, {name: 'value2'}, {name: 'value3'}, {name: 'value4'}],
      }, 'field2', 'field3'],
    },
    onValueUpdate: mockonValueUpdate,
    onFieldChange: mockonFieldChange,
    showLookupModal: jest.fn(),
    options: [],
  };

  test('should pass the initial render', () => {
    initSuggestions(props);
    expect(screen.getByText('New lookup')).toBeInTheDocument();
    expect(screen.getByText('value1')).toBeInTheDocument();
    expect(screen.getByText('value2')).toBeInTheDocument();
    expect(screen.getByText('value3')).toBeInTheDocument();
    expect(screen.getByText('value4')).toBeInTheDocument();
    expect(screen.getByText('record.age')).toBeInTheDocument();
    expect(screen.getByText('record.id')).toBeInTheDocument();
    expect(screen.getByText('record.name')).toBeInTheDocument();
  });
  test('should open the LookupAction modal and call the onValueUpdate function passed in props when clicked on edit button for a particular lookup', async () => {
    initSuggestions(props);

    await userEvent.click(screen.getByText('value1'));
    await waitFor(() => expect(mockonValueUpdate).toHaveBeenCalledWith('{{lookup.value1}}'));
  });
  test('should call the update function with a different argument when "showSuggestionsWithoutHandlebar" prop is true', async () => {
    initSuggestions({...props, showSuggestionsWithoutHandlebar: true});
    await userEvent.click(screen.getByText('value1'));
    await waitFor(() => expect(mockonValueUpdate).toHaveBeenCalledWith('value1'));
  });
  test('should open the LookupActionMenu when clicked on "New label" button', async () => {
    initSuggestions(props);
    expect(screen.getByText('New lookup')).toBeInTheDocument();
    await userEvent.click(screen.getByText('New lookup'));
    expect(screen.getByText('Use custom default value')).toBeInTheDocument();
    expect(screen.getByText('Use null as default value')).toBeInTheDocument();
    expect(screen.getByText('Use empty string as default value')).toBeInTheDocument();
    expect(screen.getByText('Action to take if unique match not found')).toBeInTheDocument();
    expect(screen.getByText('Relative URI')).toBeInTheDocument();
    expect(screen.getByText('HTTP method')).toBeInTheDocument();
    expect(screen.getByText('Please select')).toBeInTheDocument();
    expect(screen.getByText('Resource identifier path')).toBeInTheDocument();
    const fields = screen.getAllByRole('textbox');

    expect(fields).toHaveLength(3);
  });
  test('should call the onFieldChange function passed in props when LookupActionMenu is saved', async () => {
    const modifiedLookup = [
      { name: 'value1' },
      { name: 'value2' },
      { name: 'value3' },
      { name: 'value4' },
      {
        allowFailures: false,
      },
    ];

    initSuggestions(props);
    expect(screen.getByText('New lookup')).toBeInTheDocument();
    await userEvent.click(screen.getByText('New lookup'));
    expect(screen.getByText('Save')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Save'));
    await waitFor(() => expect(mockonFieldChange).toHaveBeenCalledWith('http.lookups', modifiedLookup));
  });
  test('should call the onFieldChange function passed in props when LookupActionMenu of filtered lookup is saved', async () => {
    const modifiedLookup = [
      {
        allowFailures: false,
        name: 'value1',
      },
      { name: 'value2' },
      { name: 'value3' },
      { name: 'value4' },
    ];

    initSuggestions(props);
    await userEvent.click(screen.getAllByText('Edit')[0]);
    expect(screen.getByText('Save')).toBeInTheDocument();
    await userEvent.click(screen.getByText('Save'));
    await waitFor(() => expect(mockonFieldChange).toHaveBeenCalledWith('http.lookups', modifiedLookup));
  });
  test('should call the onValueUpdate function passed in props when clicked on sampledata object key', async () => {
    initSuggestions(props);
    expect(screen.getByText('record.id')).toBeInTheDocument();
    await userEvent.click(screen.getByText('record.id'));
    await waitFor(() => expect(mockonValueUpdate).toHaveBeenCalledWith('{{record.id}}'));
  });
  test('should only display the sampleData paths when showlookup prop is false', () => {
    initSuggestions({...props, showLookup: false});
    expect(screen.getByText('record.id')).toBeInTheDocument();
    expect(screen.getByText('record.name')).toBeInTheDocument();
    expect(screen.getByText('record.age')).toBeInTheDocument();
    expect(screen.queryByText('value1')).toBeNull();
    expect(screen.queryByText('New lookup')).toBeNull();
  });
});

