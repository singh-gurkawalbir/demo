
import React from 'react';
import {screen} from '@testing-library/react';
import DynaSelectAmazonSellerCentralAPIType from './DynaSelectAmazonSellerCentralAPIType';
import { renderWithProviders, reduxStore, mutateStore} from '../../../test/test-utils';

const initialStore = reduxStore;

mutateStore(initialStore, draft => {
  draft.session.form.someformKey = {fields: {_connectionId: {value: 'someconnectionId'}}};

  draft.data.resources.connections = [{
    _id: 'someconnectionId',
    http: {
      type: 'Amazon-Hybrid',
    },
  }];
});

const props =
{
  label: 'API type',
  skipDefault: true,
  skipSort: true,
  options: [
    {
      items: [
        {
          label: 'Selling Partner API (SP-API)',
          value: 'Amazon-SP-API',
        },
        {
          label: 'Marketplace Web Service API (MWS)',
          value: '',
        },
      ],
    },
  ],
  defaultValue: '',
  formKey: 'someformKey',
};

describe('dynaSelectAmazonSellerCentralAPIType UI test cases', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('should show empty dom when no props provided', () => {
    const {utils} = renderWithProviders(<DynaSelectAmazonSellerCentralAPIType />);

    expect(utils.container).toBeEmptyDOMElement();
  });
  test('should show option provided from props', () => {
    renderWithProviders(
      <DynaSelectAmazonSellerCentralAPIType
        {...props}
    />, {initialStore});

    expect(screen.getByText('API type')).toBeInTheDocument();
    expect(screen.getByText('Marketplace Web Service API (MWS)')).toBeInTheDocument();
  });
});
