
import React from 'react';
import { waitFor } from '@testing-library/react';
import DynaReferencedFieldsIA from './DynaReferencedFieldsIA';
import { mutateStore, renderWithProviders } from '../../../../../test/test-utils';
import { getCreatedStore } from '../../../../../store';

const mockDynaReferencedFields = jest.fn();
const initialStore = getCreatedStore();

jest.mock('../DynaReferencedFields', () => ({
  __esModule: true,
  ...jest.requireActual('../DynaReferencedFields'),
  default: props => {
    mockDynaReferencedFields(props);

    return <div>DynaReferencedFields</div>;
  },
}));

describe('dynaReferencedFieldsIA UI tests', () => {
  test('should pass the initial render', async () => {
    const fieldMetaProps = {resource: {}, properties: {_exportId: '5efd8663a56953365bd28541'}};
    const props = fieldMetaProps;

    mutateStore(initialStore, draft => {
      draft.data.resources = {exports: [{
        _id: '5efd8663a56953365bd28541',
        _connectionId: '6afd8663a56953365bd28541',
        salesforce: {
          sObjectType: 'Quote',
        },
      }]};
    });

    renderWithProviders(<DynaReferencedFieldsIA {...props} />, {initialStore});
    await waitFor(() => expect(mockDynaReferencedFields).toHaveBeenCalledWith({...fieldMetaProps, options: 'Quote', connectionId: '6afd8663a56953365bd28541'}));
  });
});
