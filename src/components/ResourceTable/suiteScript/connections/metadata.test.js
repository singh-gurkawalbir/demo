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
  },
};

function existanceOfCellInDom(text, role) {
  const cells = screen.getAllByRole(role);

  return cells.findIndex(each => each.textContent === text);
}

function expectFunction(header, cell) {
  expect(header).toBeGreaterThan(-1);
  expect(cell).toBeGreaterThan(-1);
  expect(cell).toEqual(header);
}

function renderFunction(resource) {
  renderWithProviders(
    <MemoryRouter>
      <CeligoTable
        actionProps={{}}
        {...metadata}
        data={[resource]}
        />
    </MemoryRouter>
  );
}

describe('Suite script connection metadata UI test', () => {
  let headerI;
  let cellI;

  test('should verify the coulmns for unknown resource type', () => {
    renderFunction(resource);
    headerI = existanceOfCellInDom('Name', 'columnheader');
    cellI = existanceOfCellInDom('3D Cart Staging delete', 'cell');
    expectFunction(headerI, cellI);

    headerI = existanceOfCellInDom('Type', 'columnheader');
    cellI = existanceOfCellInDom('rest', 'cell');
    expectFunction(headerI, cellI);

    headerI = existanceOfCellInDom('API', 'columnheader');
    cellI = existanceOfCellInDom('https://apirest.3dcart.com', 'cell');

    expectFunction(headerI, cellI);

    headerI = existanceOfCellInDom('Username', 'columnheader');
    cellI = existanceOfCellInDom('SomeUserName', 'cell');
    expectFunction(headerI, cellI);
  });
  test('should verify the coulmns for ftp Type field ', () => {
    renderFunction({...resource, type: 'sftp', ftp: {hostURI: 'FTPhostURI', username: 'FTP userName'}});
    headerI = existanceOfCellInDom('Name', 'columnheader');
    cellI = existanceOfCellInDom('3D Cart Staging delete', 'cell');
    expectFunction(headerI, cellI);

    headerI = existanceOfCellInDom('Type', 'columnheader');
    cellI = existanceOfCellInDom('SFTP', 'cell');
    expectFunction(headerI, cellI);

    headerI = existanceOfCellInDom('API', 'columnheader');
    cellI = existanceOfCellInDom('FTPhostURI', 'cell');

    expectFunction(headerI, cellI);

    headerI = existanceOfCellInDom('Username', 'columnheader');
    cellI = existanceOfCellInDom('FTP userName', 'cell');
    expectFunction(headerI, cellI);
  });
});
