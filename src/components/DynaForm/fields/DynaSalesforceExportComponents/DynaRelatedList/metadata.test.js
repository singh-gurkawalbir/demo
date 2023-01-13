
import metadata from './metadata';

describe('dynaRelatedList metadata UI tests', () => {
  test('should render row data correctly', () => {
    const useColumns = metadata.useColumns();

    const relation = useColumns.find(eachColumn => eachColumn.key === 'relationship');
    const relationShipName = relation.Value({
      rowData: {relationshipName: 'test'},
    });

    expect(relationShipName).toBe('test');

    const sObject = useColumns.find(eachColumn => eachColumn.key === 'childSObject');
    const sObjectType = sObject.Value({
      rowData: {sObjectType: {}},
    });

    expect(sObjectType).toEqual({});

    const fields = useColumns.find(eachColumn => eachColumn.key === 'referencedFields');
    const referencedFields = fields.Value({
      rowData: {referencedFields: 'test fields'},
    });

    expect(referencedFields).toBe('test fields');

    const filter = useColumns.find(eachColumn => eachColumn.key === 'filter');
    const filterValue = filter.Value({
      rowData: {filter: 'test filter'},
    });

    expect(filterValue).toBe('test filter');
  });
});
