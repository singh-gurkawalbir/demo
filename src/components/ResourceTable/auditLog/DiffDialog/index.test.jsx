
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
import DiffDialog from '.';
import { renderWithProviders } from '../../../../test/test-utils';

const mockReact = React;

jest.mock('@mui/material/IconButton', () => ({
  __esModule: true,
  ...jest.requireActual('@mui/material/IconButton'),
  default: props => {
    const mockProps = {...props};

    delete mockProps.autoFocus;

    return mockReact.createElement('IconButton', mockProps, mockProps.children);
  },
}));
describe('uI test cases for DiffDialog', () => {
  const data = {
    byUser: {
      name: 'auditlogs',
      email: 'auditlogtest@celigo.com',
    },
    source: 'UI',
    _resourceId: '6366bee72c1bd1023108c05b',
    resourceType: 'flow',
    event: 'Update',
    fieldChange: {
      fieldPath: 'pageProcessors',
      oldValue: {
        responseMapping: {
          fields: [],
          lists: [],
        },
        type: 'import',
        _importId: '6321ff7a0643cf0e259ffb86',
      },
      newValue: '2022-11-07T20:20:23.020Z',
    },
    _id: 'auditlogs',
  };
  const onClose = () => {};

  test('should display flow auditlog dialog', () => {
    renderWithProviders(<DiffDialog auditLog={data} onClose={onClose} />);
    expect(screen.getByText('Flow Audit log')).toBeInTheDocument();
    expect(screen.getByText('Field pageProcessors')).toBeInTheDocument();
    expect(screen.getByText('"2022-11-07T20:20:23.020Z"')).toBeInTheDocument();
    const onCloseButtonNode = document.querySelector('svg[data-testid="closeModalDialog"]');

    expect(onCloseButtonNode).toBeInTheDocument();
  });
});
