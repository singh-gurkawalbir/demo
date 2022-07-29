/* global describe, test, expect */

import React from 'react';
import { Link } from 'react-router-dom';
import defaultRef from '.';
import NameCell from '../../../../../components/ResourceTable/flows/cells/NameCell';
import getRoutePath from '../../../../../utils/routePaths';

describe('metdata flows test cases', () => {
  test('should pass the initial render with default value', () => {
    const columns = defaultRef.useColumns();

    const value1Ref = columns[0].Value({
      rowData: {
        _id: 'id_1',
        _integrationId: 'integration_id_1',
        _connectorId: 'connector_id',
        name: 'name',
        description: 'description',
      },
    });

    expect(value1Ref).toEqual(
      <NameCell
        flowId="id_1"
        integrationId="integration_id_1"
        isIntegrationApp
        name="name"
        description="description"
        isFree={undefined}
      />);

    const value2Ref = columns[1].Value({
      rowData: {
        integrationName: 'integrationName',
      },
    });

    expect(value2Ref).toEqual((
      <div>
        <Link to={getRoutePath('/integrations/none')}>integrationName</Link>
      </div>
    ));
  });
});
