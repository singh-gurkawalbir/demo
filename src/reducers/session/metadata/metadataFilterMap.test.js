/* global describe, test, expect */

import metadataFilterMap from './metadataFilterMap';

describe('tests for metadata filter map', () => {
  test('should return same data if filter is of type raw', () => {
    const data = {
      name: 'account',
    };

    expect(metadataFilterMap.raw(data)).toEqual(data);
  });

  test('should return value and label for type suitescript-settings-options', () => {
    const data = {
      options: [['accountid', 'Account Id']],
    };

    expect(metadataFilterMap['suitescript-settings-options'](data)).toEqual([{
      label: 'Account Id',
      value: 'accountid',
    }]);
  });

  test('should transform metadata for type suitescript-recordTypes', () => {
    const data = [{
      scriptId: 'revenueplan',
      name: 'Revenue Recognition Plan',
      permissionId: 'LIST_REVENUEPLAN',
      scriptable: true,
      url: '/app/accounting/revrec/revenueplan.nl',
      doesNotSupportCreate: true,
    }];

    expect(metadataFilterMap['suitescript-recordTypes'](data)).toEqual([
      {
        label: 'Revenue Recognition Plan',
        value: 'revenueplan',
        url: '/app/accounting/revrec/revenueplan.nl',
        doesNotSupportCreate: true,
      },
    ]);
  });

  test('should transform metadata for type suitescript-recordTypes if includes subrecord config', () => {
    const data = [{
      scriptId: 'assemblybuild',
      name: 'Assembly Build',
      permissionId: 'TRAN_BUILD',
      scriptable: true,
      url: '/app/accounting/transactions/build.nl',
      id: 'assemblybuild',
      userPermission: '4',
      hasSubRecord: true,
      subRecordConfig: [
        {
          id: 'celigo_inventorydetail',
          name: 'Inventory Detail',
          subRecordType: 'inventorydetail',
        },
        {
          id: 'component[*].celigo_inventorydetail',
          name: 'Components : Inventory Details',
          subRecordType: 'componentinventorydetail',
        },
      ],
    }];

    expect(metadataFilterMap['suitescript-recordTypes'](data)).toEqual([
      {
        label: 'Assembly Build',
        value: 'assemblybuild',
        url: '/app/accounting/transactions/build.nl',
        hasSubRecord: true,
        subRecordConfig: [
          {
            id: 'celigo_inventorydetail',
            name: 'Inventory Detail',
            subRecordType: 'inventorydetail',
          },
          {
            id: 'component[*].celigo_inventorydetail',
            name: 'Components : Inventory Details',
            subRecordType: 'componentinventorydetail',
          },
        ],
      },
    ]);
  });

  test('should transform data for key suitescript-recordTypeDetail', () => {
    const data = [{
      name: 'Sales Order',
      id: 'salesorder',
      type: 'transaction',
      sublist: 'item',
    }];

    expect(metadataFilterMap['suitescript-recordTypeDetail'](data)).toEqual([{
      label: 'Sales Order',
      value: 'salesorder',
      type: 'transaction',
      sublist: 'item',
    }]);
  });
});
