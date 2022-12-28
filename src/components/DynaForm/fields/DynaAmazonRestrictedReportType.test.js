
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders, reduxStore } from '../../../test/test-utils';
import DynaAmazonRestrictedReportType from './DynaAmazonRestrictedReportType';

async function initDynaAmazonRestrictedReportType(props) {
  const initialStore = reduxStore;

  initialStore.getState().session.form = {
    _formKey: {
      fields: {
        _connectionId: {value: '_amazonConnectionId'},
        'http.relativeURI': {value: '/reports/2021-06-30/documents/xyz'},
        'unencrypted.apiType': {value: 'Amazon-SP-API'},
      },
    },
  };
  initialStore.getState().data.resources = {
    connections: [{
      _id: '_amazonConnectionId',
      http: {
        type: 'Amazon-SP-API',
      },
    }],
  };

  return renderWithProviders(<DynaAmazonRestrictedReportType {...props} />, { initialStore });
}
describe('dynaAmazonRestrictedReportType tests', () => {
  test('should able to test DynaAmazonRestrictedReportType with showAmazonRestrictedReportType', async () => {
    await initDynaAmazonRestrictedReportType({formKey: '_formKey'});
    expect(screen.queryByRole('checkbox')).toBeInTheDocument();
  });
  test('should able to test DynaAmazonRestrictedReportType with incorrect formKey', async () => {
    await initDynaAmazonRestrictedReportType({formKey: 'rmKey'});
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});

