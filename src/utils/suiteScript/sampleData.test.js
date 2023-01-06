import { getFormattedNetsuiteMetadataData, getSuiteScriptNetsuiteRealTimeSampleData } from './sampleData';

describe('utils/suiteScript/sampleData test cases', () => {
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
  describe('getSuiteScriptNetsuiteRealTimeSampleData util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(getSuiteScriptNetsuiteRealTimeSampleData()).toEqual([]);
    });
    test('should return correct formatted metadata if sublist is undefined and type is select and id is _billingaddress_state and ns record type is salesorder', () => {
      const metadata = [{id: '_billingaddress_state', type: 'select'}];

      expect(getSuiteScriptNetsuiteRealTimeSampleData(metadata, 'salesorder')).toEqual(
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
    test('should return correct formatted metadata if sublist is undefined and type is select and id is _billingaddress_state', () => {
      const metadata = [{id: '_billingaddress_state', type: 'select'}];

      expect(getSuiteScriptNetsuiteRealTimeSampleData(metadata)).toEqual(
        [{id: '_billingaddress_state.name', type: 'select'},
          {id: '_billingaddress_dropdownstate.internalid', name: 'Billing State (InternalId)', type: 'select'},
          {id: '_billingaddress_dropdownstate.name', name: 'Billing State (Name)', type: 'select'}]
      );
    });
  });
});
