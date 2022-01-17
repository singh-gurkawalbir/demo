/* global describe, test, expect */

import { filterSubListProperties, getFormattedNetsuiteMetadataData, getFormattedSalesForceMetadata, getReferenceFieldsMap, getWSRecordId, isTransactionWSRecordType } from './metadata';

describe('isTransactionWSRecordType util', () => {
  test('should not throw exception for invalid arguments', () => {
    expect(isTransactionWSRecordType()).toBeFalsy();
  });
  test('should return true if recordId exists in transaction type ids', () => {
    const recordIds = [
      'assemblybuild',
      'assemblyunbuild',
      'cashrefund',
      'cashsale',
      'check',
      'creditmemo',
      'customerdeposit',
      'customerpayment',
      'customerrefund',
      'depositapplication',
      'estimate',
      'expensereport',
      'intercompanyjournalentry',
      'inventoryadjustment',
      'inventorytransfer',
      'invoice',
      'itemfulfillment',
      'itemreceipt',
      'journalentry',
      'opportunity',
      'purchaseorder',
      'returnauthorization',
      'salesorder',
      'timebill',
      'transferorder',
      'vendorbill',
      'vendorcredit',
      'vendorpayment',
      'vendorreturnauthorization',
      'workorder',
    ];

    recordIds.forEach(recordId => {
      expect(isTransactionWSRecordType(recordId)).toBeTruthy();
    });
  });
  test('should return false if recordId does not exist in transaction type ids', () => {
    expect(isTransactionWSRecordType('jwelery')).toBeFalsy();
  });
});

describe('getWSRecordId util', () => {
  test('should not throw exception for invalid arguments', () => {
    expect(getWSRecordId()).toEqual('');
  });
  test('should return scriptId if record has scriptId', () => {
    expect(getWSRecordId({scriptId: 'AbC'})).toEqual('abc');
  });
  test('should return metadataId if record has metadataId', () => {
    expect(getWSRecordId({metadataId: 'AbC'})).toEqual('abc');
  });
  test('should return internalId if record has internalId', () => {
    expect(getWSRecordId({internalId: 'AbC'})).toEqual('abc');
  });
});

describe('filterSubListProperties util', () => {
  test('should not throw exception for invalid arguments', () => {
    expect(filterSubListProperties()).toEqual();
  });
  test('should return filtered sub lists', () => {
    const fields = [{id: 'name'}, {id: 'name[*].firstName'}];

    expect(filterSubListProperties(fields)).toEqual([{id: 'name[*].firstName'}]);
  });
});

describe('getFormattedSalesForceMetadata util', () => {
  test('should not throw exception for invalid arguments', () => {
    expect(getFormattedSalesForceMetadata()).toEqual([]);
  });
  test('should return correct formatted salesforce metadata', () => {
    const metadata = {fields: [{name: 'name', label: 'label'}, {relationshipName: '123', referenceTo: ['123']}]};

    expect(getFormattedSalesForceMetadata(metadata)).toEqual([{id: 'name', name: 'label'}]);
  });
});

describe('getReferenceFieldsMap util', () => {
  test('should not throw exception for invalid arguments', () => {
    expect(getReferenceFieldsMap()).toEqual({});
  });
  test('should return correct formatted salesforce metadata', () => {
    const refFields = ['name.label', 'field1', null];

    expect(getReferenceFieldsMap(refFields)).toEqual({name: {label: 'name.label'}, field1: 'field1'});
  });
});

describe('getFormattedNetsuiteMetadataData util', () => {
  test('should not throw exception for invalid arguments', () => {
    expect(getFormattedNetsuiteMetadataData()).toEqual([]);
  });
  test('should return correct formatted metadata if sublist is _billing_addressbook and type is not select', () => {
    const metadata = [{sublist: '_billing_addressbook', id: '_billing_addressbook[*].name', type: 'replace'}];

    expect(getFormattedNetsuiteMetadataData(metadata)).toEqual([{id: '_billingaddress_name', type: 'replace'}]);
  });
  test('should return correct formatted metadata if sublist is _shipping_addressbook and type is not select', () => {
    const metadata = [{sublist: '_shipping_addressbook', id: '_shipping_addressbook[*].name', type: 'replace'}];

    expect(getFormattedNetsuiteMetadataData(metadata)).toEqual([{id: '_shippingaddress_name', type: 'replace'}]);
  });
  test('should return correct formatted metadata if sublist is _billing_addressbook and type is select', () => {
    const metadata = [{sublist: '_billing_addressbook', id: '_billing_addressbook[*]', type: 'select'}];

    expect(getFormattedNetsuiteMetadataData(metadata)).toEqual([{ id: '_billing_addressbook[*].name.name', type: 'select'}]);
  });
  test('should return correct formatted metadata if sublist exists and type is select', () => {
    const metadata = [{sublist: '_customer_name', id: '_billing_addressbook[*].name.name', type: 'select'}];

    expect(getFormattedNetsuiteMetadataData(metadata)).toEqual(
      [{id: '_billing_addressbook[*].name.name', type: 'select'}]
    );
  });
  test('should return correct formatted metadata if sublist is undefined and type is select', () => {
    const metadata = [{id: '_billing_addressbook', type: 'select'}];

    expect(getFormattedNetsuiteMetadataData(metadata)).toEqual([{id: '_billing_addressbook.name', type: 'select'}]);
    expect(getFormattedNetsuiteMetadataData([{...metadata[0], id: '_billing_addressbook.name'}])).toEqual([{id: '_billing_addressbook.name', type: 'select'}]);
  });
  test('should return correct formatted metadata if sublist is undefined and type is select and id is _billingaddress_state', () => {
    const metadata = [{id: '_billingaddress_state', type: 'select'}];

    expect(getFormattedNetsuiteMetadataData(metadata)).toEqual(
      [{id: '_billingaddress_state.name', type: 'select'},
        {id: '_billingaddress_dropdownstate.internalid', name: 'Billing State (InternalId)', type: 'select'},
        {id: '_billingaddress_dropdownstate.name', name: 'Billing State (Name)', type: 'select'}]
    );
  });
  test('should return correct formatted metadata if sublist is undefined and type is select and id is _shippingaddress_state', () => {
    const metadata = [{id: '_shippingaddress_state', type: 'select'}];

    expect(getFormattedNetsuiteMetadataData(metadata)).toEqual(
      [{id: '_shippingaddress_state.name', type: 'select'},
        {id: '_shippingaddress_dropdownstate.internalid', name: 'Shipping State (InternalId)', type: 'select'},
        {id: '_shippingaddress_dropdownstate.name', name: 'Shipping State (Name)', type: 'select'}]
    );
  });
  test('should return correct formatted metadata if sublist is undefined and type is select and id is _billingaddress_state and ns record type is salesorder', () => {
    const metadata = [{id: '_billingaddress_state', type: 'select'}];

    expect(getFormattedNetsuiteMetadataData(metadata, 'salesorder')).toEqual(
      [{id: '_billingaddress_state.name', type: 'select'},
        {id: '_billingaddress_dropdownstate.internalid', name: 'Billing State (InternalId)', type: 'select'},
        {id: '_billingaddress_dropdownstate.name', name: 'Billing State (Name)', type: 'select'},
        {id: 'billcountry', name: 'Billing Address Country', type: 'select'},
        {id: 'billingaddress.country.internalid', name: 'Billing Address : Country(InternalId)', type: 'select'},
        {id: 'billingaddress.country.name', name: 'Billing Address : Country (Name)', type: 'select'},
        {id: 'shippingaddress.country.internalid', name: 'Shipping Address : Country(InternalId)', type: 'select'},
        {id: 'shippingaddress.country.name', name: 'Shipping Address : Country (Name)', type: 'select'},
        {id: 'shipcountry', name: 'Shipping Address Country', type: 'select'}]
    );
  });
  test('should return correct formatted metadata if sublist is undefined and type is select and id is _billingaddress_state and ns record type is customer', () => {
    const metadata = [{id: '_billingaddress_state', type: 'select'}];

    expect(getFormattedNetsuiteMetadataData(metadata, 'customer')).toEqual(
      [{id: '_billingaddress_state.name', type: 'select'},
        {id: '_billingaddress_dropdownstate.internalid', name: 'Billing State (InternalId)', type: 'select'},
        {id: '_billingaddress_dropdownstate.name', name: 'Billing State (Name)', type: 'select'}]
    );
  });
});
