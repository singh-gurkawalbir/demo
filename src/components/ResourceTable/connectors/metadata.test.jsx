
import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { screen } from '@testing-library/react';
import Link from '@mui/material/Link';
import { TimeAgo } from '@celigo/fuse-ui';
import { renderWithProviders } from '../../../test/test-utils';
import LogoStrip from '../../LogoStrip';
import OnOffCell from './cells/OnOffCell';
import defaultRef from './metadata';
import Delete from '../commonActions/Delete';
import Edit from '../commonActions/Edit';
import InstallBase from './actions/InstallBase';
import Licenses from './actions/Licenses';

jest.mock('../../TextOverflowCell', () => ({
  __esModule: true,
  ...jest.requireActual('../../TextOverflowCell'),
  default: () => <div>textoverflow</div>,
}));

const jobdata = {
  _id: '634cc85cc485937caa99e6a1',
  _integrationId: '56d6b23fe1fc35de53914730',
  createdAt: '2022-10-17T03:13:32.088Z',
  duration: '00:00:05',
  endedAt: '2022-10-17T03:13:37.156Z',
  lastExecutedAt: '2022-10-17T03:13:37.156Z',
  lastModified: '2022-10-17T03:13:57.480Z',
  name: 'Exportname',
  type: 'export',
};

const jobdata1 = {
  _id: '634cc85cc434caa99e6a1',
  published: true,
  applications: ['netsuite', 'mysql'],
};

function ComponentForColumns() {
  const columndata = defaultRef.useColumns();

  return <div>{columndata[1].Value({ rowData: { resouce: 'r' } })}</div>;
}

describe('uI test cases for ResourceTable connectors', () => {
  test('should display first column component', () => {
    renderWithProviders(<ComponentForColumns />);
    const res1 = screen.getByText('textoverflow');

    expect(res1).toBeInTheDocument();
  });

  test('should pass the initial render with default value', () => {
    const columns = defaultRef.useColumns();
    const value1Ref = columns[0].Value({
      rowData: {
        applications: ['3dcart', 'docusign'],
      },
    });

    expect(value1Ref).toEqual(
      <LogoStrip
        rows={1}
        columns={4}
        size="medium"
        applications={['3dcart', 'docusign']}
      />
    );
    const value2Ref = columns[2].Value({
      rowData: jobdata,
    });

    expect(value2Ref).toEqual(
      <TimeAgo date="2022-10-17T03:13:57.480Z" />
    );

    const valuelinkRef = columns[3].Value({
      rowData: {
        websiteURL: 'https://www.yahoo.com',
      },
    });

    expect(valuelinkRef).toEqual(
      <Link href="https://www.yahoo.com" target="_blank" underline="none">
        View
      </Link>
    );

    const valuelinkRef1 = columns[3].Value({
      rowData: {
        websiteURL: '',
      },
    });

    expect(valuelinkRef1).toBeNull();

    const valuelinkRef2 = columns[3].Value({
      rowData: {
        websiteURL: 'www.google.com',
      },
    });

    expect(valuelinkRef2).toEqual(
      <Link href="https://www.google.com" target="_blank" underline="none">
        View
      </Link>
    );
    const value4Ref = columns[4].Value({
      rowData: jobdata1,
    });

    expect(value4Ref).toEqual(
      <OnOffCell
        connectorId="634cc85cc434caa99e6a1"
        published
        applications={['netsuite', 'mysql']}
        resourceType="connectors"
        tooltip="Unpublish / Publish"
      />
    );
    const useRowActions = defaultRef.useRowActions();

    expect(useRowActions).toEqual([Edit, InstallBase, Licenses, Delete]);
  });
});
