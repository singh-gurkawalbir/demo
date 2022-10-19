/* global describe, test, expect, jest */
import React from 'react';
import * as tableContext from '../CeligoTable/TableContext';
import ResourceLink from '../ResourceLink';
import metadata from './metadata';

describe('ResourceDrawer UI test', () => {
  test('resource type wrong', () => {
  });
  test('should verify the various keys in the usecolumns array', () => {
    const [first, second] = metadata.useColumns();

    expect(first.key).toBe('name');
    expect(first.heading).toBe('Name');
    expect(first.isLoggable).toBe(true);
    expect(second.key).toBe('type');
    expect(second.heading).toBe('Type');
    expect(second.isLoggable).toBe(true);
  });
  test('should verify the value property is second usecolumn array', () => {
    const columnsArray = metadata.useColumns();

    const Value = columnsArray[1].Value({rowData: {resourceType: 'someType'}});

    expect(Value).toBe('someType');
  });
  test('should verify the value property is first usecolumn array', () => {
    const onClose = jest.fn();

    jest.spyOn(tableContext, 'useGetTableContext').mockReturnValue({onClose, integrationId: '1'});

    const columnsArray = metadata.useColumns();
    const Value = columnsArray[0].Value({rowData: {resourceType: 'someType', name: 'name', id: 'id'}});

    expect(Value).toEqual(
      <ResourceLink
        integrationId="1"
        name="name"
        resourceType="someType"
        id="id"
        onClick={onClose}
          />
    );
  });
});
