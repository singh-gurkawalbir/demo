/* global describe, expect, jest, test, */
import React from 'react';
import { waitFor } from '@testing-library/react';
import DynaRelatedListIA from './DynaRelatedListIA';
import { renderWithProviders } from '../../../../../test/test-utils';

const mockDynaRelatedList = jest.fn();

jest.mock('../DynaRelatedList', () => ({
  __esModule: true,
  ...jest.requireActual('../DynaRelatedList'),
  default: props => {
    mockDynaRelatedList(props);

    return <div>DynaRelatedList</div>;
  },
}));
jest.mock('./DynaReferencedFieldsIA', () => ({
  __esModule: true,
  ...jest.requireActual('./DynaReferencedFieldsIA'),
  useGetSalesforceExportDetails: () => ({ sObjectType: 'Quote', connectionId: '5efd8663a56953365bd28541'}),
}));

describe('DynaRelatedListIA UI tests', () => {
  test('should pass the initial render', async () => {
    const props = {fieldMetaProps: {}};

    renderWithProviders(<DynaRelatedListIA {...props} />);
    await waitFor(() => expect(mockDynaRelatedList).toBeCalledWith({fieldMetaProps: {}, options: 'Quote', connectionId: '5efd8663a56953365bd28541'}));
  });
});
