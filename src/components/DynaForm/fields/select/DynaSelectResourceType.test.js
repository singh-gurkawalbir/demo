
import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders, reduxStore, mutateStore } from '../../../../test/test-utils';
import DynaSelectResourceType from './DynaSelectResourceType';

const onFieldChange = jest.fn();
const props = {mode: 'destination', flowId: '_flowId1', onFieldChange, id: 'resourceType'};

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

async function initDynaSelectResourceType(props = {}) {
  const initialStore = reduxStore;

  mutateStore(initialStore, draft => {
    draft.data = {
      resources: {
        flows: [
          {
            _id: '_flowId1',
            pageGenerators: [{_exportId: '_exp1'}],
          },
          {
            _id: '_flowId2',
            _exportId: '_exp2',
          },
        ],
        exports: [{
          _id: '_exp2',
          type: 'simple',
        }],
      },
    };
  });

  return renderWithProviders(<DynaSelectResourceType {...props} />, { initialStore });
}
describe('dynaSelectResourceType tests', () => {
  afterEach(() => {
    onFieldChange.mockClear();
  });
  test('should test dynaSelect for resourceTypes without options having any application selected', async () => {
    await initDynaSelectResourceType(props);
    expect(screen.getByText('Please select')).toBeInTheDocument();
  });
  test('should test dynaSelect for resourceTypes with options having selectedApplication as salesforce', async () => {
    await initDynaSelectResourceType({...props, options: {selectedApplication: {assistant: 'salesforce'}}});
    expect(onFieldChange).toHaveBeenCalledWith('resourceType', '', true);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Import records into destination application')).toBeInTheDocument();
    expect(screen.getByText('Look up additional files (per record)')).toBeInTheDocument();
    expect(screen.getByText('Look up additional records (per record)')).toBeInTheDocument();
    expect(screen.getByText('Transfer files into destination application')).toBeInTheDocument();
  });
  test('should test dynaSelect for resourceTypes with options having selectedApplication as as2', async () => {
    await initDynaSelectResourceType({...props, options: {selectedApplication: {name: 'as2', _httpConnectorId: '_somId'}}});
    expect(onFieldChange).toHaveBeenCalledWith('resourceType', 'importRecords', true);
    expect(screen.getByText('Please select')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    // dynaSelect is disabled, hence no menuitems
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });
  test('should test dynaSelect for resourceTypes with options having selectedApplication as dataLoader', async () => {
    await initDynaSelectResourceType({...props, flowId: '_flowId2', options: {selectedApplication: {assistant: 'googledrive'}}});
    expect(onFieldChange).toHaveBeenCalledWith('resourceType', 'importRecords', true);
    expect(screen.getByText('Please select')).toBeInTheDocument();
  });
  test('should test dynaSelect for resourceTypes with mode source and common export', async () => {
    await initDynaSelectResourceType({...props, mode: 'source', options: {selectedApplication: {}}});
    expect(onFieldChange).toHaveBeenCalledWith('resourceType', 'exportRecords', true);
  });
  test('should test dynaSelect for resourceTypes with mode source and webhookOnly', async () => {
    await initDynaSelectResourceType({...props, mode: 'source', options: {selectedApplication: {webhookOnly: true}}});
    expect(onFieldChange).toHaveBeenCalledWith('resourceType', 'webhook', true);
  });
  test('should test dynaSelect for resourceTypes with mode source and webhook assistant', async () => {
    await initDynaSelectResourceType({...props, mode: 'source', options: {selectedApplication: {webhook: true, assistant: 'webhook1'}}});
    expect(onFieldChange).toHaveBeenCalledWith('resourceType', '', true);
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Export records from source application')).toBeInTheDocument();
    expect(screen.getByText('Listen for real-time data from source application')).toBeInTheDocument();
  });
  test('should test dynaSelect for resourceTypes with mode source and nesuitejdbc', async () => {
    await initDynaSelectResourceType({...props, mode: 'destination', options: {selectedApplication: {type: 'netsuitejdbc'}}});
    expect(onFieldChange).toHaveBeenCalledWith('resourceType', 'lookupFiles', true);
  });
});

