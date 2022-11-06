/* global describe, expect, test */
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { reduxStore, renderWithProviders } from '../../../../test/test-utils';
import AliasResourceName from './AliasResourceName';

const initialStore = reduxStore;

initialStore.getState().data.resources.imports = [{
  _id: '5ffad3d1f08d35214ed200g7',
  lastModified: '2021-01-22T08:40:45.731Z',
  name: 'concur expense',
  install: [],
  sandbox: false,
  _registeredConnectionIds: [
    '5cd51efd3607fe7d8eda9c88',
    '5feafe6bf415e15f455dbc89',
  ],
  installSteps: [],
  uninstallSteps: [],
  flowGroupings: [],
  createdAt: '2021-01-10T10:15:45.184Z',
}];

describe('UI test cases for aliasresourcename', () => {
  test('should render the table accordingly', () => {
    const alias = {
      _importId: '5ffad3d1f08d35214ed200g7',
    };

    renderWithProviders(<AliasResourceName alias={alias} />, {initialStore});
    expect(screen.getByText('concur expense')).toBeInTheDocument();
  });
});
