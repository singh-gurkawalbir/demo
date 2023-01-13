
import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithProviders, reduxStore } from '../../../../test/test-utils';
import DynaTextWithConnectionContext from './DynaTextWithConnectionContext';

const props = {formKey: '_formKey', connectionId: '_connectionId'};

async function initDynaTextWithConnectionContext(props, value = 'json') {
  const initialStore = reduxStore;

  initialStore.getState().data.resources = {
    connections: [
      {_id: '_connectionId', http: {mediaType: 'urlencoded'}},
    ],
  };
  initialStore.getState().session.form = {
    _formKey: {
      fields: {
        'http.requestMediaType': {
          value,
        },
      },
    },
  };

  return renderWithProviders(<DynaTextWithConnectionContext {...props} />, { initialStore });
}
describe('dynaTextWithConnectionContext tests', () => {
  test('should able to test DynaTextWithConnectionContext with requestMediaType JSON', async () => {
    await initDynaTextWithConnectionContext(props);
    expect(screen.queryByRole('textbox')).toBeInTheDocument();
  });
  test('should able to test DynaTextWithConnectionContext with requestMediaType URLEncoded', async () => {
    await initDynaTextWithConnectionContext(props);
    expect(screen.queryByRole('textbox')).toBeInTheDocument();
  });
  test('should able to test DynaTextWithConnectionContext with requestMediaType null/undefined/empty', async () => {
    await initDynaTextWithConnectionContext(props, '');
    expect(screen.queryByRole('textbox')).toBeInTheDocument();
  });
  test('should able to test DynaTextWithConnectionContext without connectionMediaType and resourceMediaType', async () => {
    await initDynaTextWithConnectionContext({...props, connectionId: '_randomId'}, 'xml');
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});

