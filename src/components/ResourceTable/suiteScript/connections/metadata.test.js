/* global test, expect, describe */
import React from 'react';
import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { renderWithProviders } from '../../../../test/test-utils';
import metadata from './metadata';
import CeligoTable from '../../../CeligoTable';

const resource = {
  _id: '5e7068331c056a75e6df19b2',

  hostURI: 'somehostURI',
  createdAt: '2020-03-17T06:03:31.798Z',
  lastModified: '2020-03-19T23:47:55.181Z',
  type: 'rest',
  name: '3D Cart Staging delete',
  assistant: '3dcart',
  offline: true,
  sandbox: false,
  isHTTP: true,
  rest: {
    username: 'SomeUserName',
    formType: 'assistant',
    mediaType: 'json',
    hostURI: 'https://apirest.3dcart.com',
    concurrencyLevel: 11,
    ping: {
      relativeURI: '/3dCartWebAPI/v1/Customers',
      method: 'GET',
    },
    headers: [
      {
        name: 'SecureUrl',
        value: 'https://celigoc1.com',
      },
      {
        name: 'PrivateKey',
        value: '{{{connection.http.encrypted.PrivateKey}}}',
      },
      {
        name: 'content-type',
        value: 'application/json',
      },
    ],
    encrypted: '******',
    encryptedFields: [],
    auth: {
      type: 'token',
      oauth: {
        scope: [],
      },
      token: {
        token: '******',
        location: 'header',
        headerName: 'Token',
        scheme: ' ',
        refreshMethod: 'POST',
        refreshMediaType: 'urlencoded',
      },
    },
  },
};

function renderFunction(resource) {
  renderWithProviders(
    <MemoryRouter>
      <CeligoTable
        actionProps={{}}
        {...metadata}
        data={
             [
               resource,
             ]
            }
            />
    </MemoryRouter>
  );
}

describe('Suite script connection metadata UI test', () => {
  test('should verify the name field', () => {
    renderFunction(resource);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('3D Cart Staging delete')).toBeInTheDocument();
  });
  test('should verify the Type field', () => {
    renderFunction(resource);
    expect(screen.getByText('Type')).toBeInTheDocument();
    expect(screen.getByText('rest')).toBeInTheDocument();
  });
  test('should verify the Type field', () => {
    renderFunction(resource);
    expect(screen.getByText('API')).toBeInTheDocument();
    expect(screen.getByText('https://apirest.3dcart.com')).toBeInTheDocument();
  });
  test('should verify the userName and hosturi for ftp Type field ', () => {
    renderFunction({...resource, type: 'sftp', ftp: {hostURI: 'FTPhostURI', username: 'FTP userName'}});
    expect(screen.getByText('FTP userName')).toBeInTheDocument();
    expect(screen.getByText('FTPhostURI')).toBeInTheDocument();
  });
  test('should verify the Username field', () => {
    renderFunction(resource);
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByText('SomeUserName')).toBeInTheDocument();
  });
});
