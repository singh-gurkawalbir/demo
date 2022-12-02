/* global describe, expect, test */
import metadata from './metadata';

describe('DynaRelatedList metadata UI tests', () => {
  test('should render row data correctly', () => {
    const useColumns = metadata.useColumns();

    const relation = useColumns.find(eachColumn => eachColumn.key === 'relationship');
    const relationShipName = relation.Value({
      rowData: {relationshipName: 'test'},
    });

    expect(relationShipName).toEqual('test');

    const sObject = useColumns.find(eachColumn => eachColumn.key === 'childSObject');
    const sObjectType = sObject.Value({
      rowData: {sObjectType: {}},
    });

    expect(sObjectType).toEqual({});

    const fields = useColumns.find(eachColumn => eachColumn.key === 'referencedFields');
    const referencedFields = fields.Value({
      rowData: {referencedFields: 'test fields'},
    });

    expect(referencedFields).toEqual('test fields');

    const filter = useColumns.find(eachColumn => eachColumn.key === 'filter');
    const filterValue = filter.Value({
      rowData: {filter: 'test filter'},
    });

    expect(filterValue).toEqual('test filter');
  });
});
