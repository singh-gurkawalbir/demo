/* global describe, test, expect */

import { filterSubListProperties, getFormattedNSCustomerSampleData, getFormattedNSSalesOrderMetadataData } from './metadata';
import {emptyList} from '../../constants';

describe('utils/suiteScript/metadata test cases', () => {
  describe('filterSubListProperties util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(filterSubListProperties()).toEqual(emptyList);
    });
    test('should return filtered sub lists', () => {
      const fields = [{id: 'name'}, {id: 'name[*].firstName'}];

      expect(filterSubListProperties(fields)).toEqual([{id: 'name[*].firstName'}]);
    });
  });
  describe('getFormattedNSCustomerSampleData util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(getFormattedNSCustomerSampleData()).toBeUndefined();
    });
    test('should return correct formatted netsuite customer sample data', () => {
      const metadata = [{id: 'currency.internalid'}, {id: 'currency.internalid'}, {id: 'currency.name'}, {id: 'currency.name'}];

      expect(getFormattedNSCustomerSampleData(metadata)).toEqual(
        [{id: 'primarycurrency.internalid'}, {id: 'currency.internalid'}, {id: 'primarycurrency.name'}, {id: 'currency.name'}]
      );
    });
  });
  describe('getFormattedNSSalesOrderMetadataData util', () => {
    test('should not throw exception for invalid arguments', () => {
      expect(getFormattedNSSalesOrderMetadataData()).toEqual(
        [{id: 'billcountry', name: 'Billing Address Country', type: 'select'},
          {id: 'billingaddress.country.internalid', name: 'Billing Address : Country(InternalId)', type: 'select'},
          {id: 'billingaddress.country.name', name: 'Billing Address : Country (Name)', type: 'select'},
          {id: 'shippingaddress.country.internalid', name: 'Shipping Address : Country(InternalId)', type: 'select'},
          {id: 'shippingaddress.country.name', name: 'Shipping Address : Country (Name)', type: 'select'},
          {id: 'shipcountry', name: 'Shipping Address Country', type: 'select'}]
      );
    });

    test('should return correct formatted netsuite sales order metadata for billphone id', () => {
      const metadata = [{id: 'billphone', type: 'select', name: 'billPhone1'}];

      expect(getFormattedNSSalesOrderMetadataData(metadata)).toEqual(
        [{id: 'billphone', name: 'billPhone1', type: 'select'},
          {group: 'Body Field', id: 'billingaddress.addrphone.internalid', name: 'billPhone1', type: 'select'},
          {group: 'Body Field', id: 'billingaddress.addrphone.name', name: 'billPhone1', type: 'select'},
          {id: 'billcountry', name: 'Billing Address Country', type: 'select'},
          {id: 'billingaddress.country.internalid', name: 'Billing Address : Country(InternalId)', type: 'select'},
          {id: 'billingaddress.country.name', name: 'Billing Address : Country (Name)', type: 'select'},
          {id: 'shippingaddress.country.internalid', name: 'Shipping Address : Country(InternalId)', type: 'select'},
          {id: 'shippingaddress.country.name', name: 'Shipping Address : Country (Name)', type: 'select'},
          {id: 'shipcountry', name: 'Shipping Address Country', type: 'select'}]
      );
    });

    test('should return correct formatted netsuite sales order metadata for billphone id and type is replace', () => {
      const metadata = [{id: 'billphone', type: 'replace', name: 'billPhone1'}];

      expect(getFormattedNSSalesOrderMetadataData(metadata)).toEqual(
        [{id: 'billphone', name: 'billPhone1', type: 'replace'},
          {group: 'Body Field', id: 'billingaddress.addrphone', name: 'billPhone1', type: 'replace'},
          {id: 'billcountry', name: 'Billing Address Country', type: 'select'},
          {id: 'billingaddress.country.internalid', name: 'Billing Address : Country(InternalId)', type: 'select'},
          {id: 'billingaddress.country.name', name: 'Billing Address : Country (Name)', type: 'select'},
          {id: 'shippingaddress.country.internalid', name: 'Shipping Address : Country(InternalId)', type: 'select'},
          {id: 'shippingaddress.country.name', name: 'Shipping Address : Country (Name)', type: 'select'},
          {id: 'shipcountry', name: 'Shipping Address Country', type: 'select'}]
      );
    });
    test('should return correct formatted netsuite sales order metadata for billzip id and type is replace', () => {
      const metadata = [{id: 'billzip', type: 'replace', name: 'billPhone1'}];

      expect(getFormattedNSSalesOrderMetadataData(metadata)).toEqual(
        [{id: 'billzip', name: 'billPhone1', type: 'replace'},
          {group: 'Body Field', id: 'billingaddress.zip', name: 'billPhone1', type: 'replace'},
          {id: 'billcountry', name: 'Billing Address Country', type: 'select'},
          {id: 'billingaddress.country.internalid', name: 'Billing Address : Country(InternalId)', type: 'select'},
          {id: 'billingaddress.country.name', name: 'Billing Address : Country (Name)', type: 'select'},
          {id: 'shippingaddress.country.internalid', name: 'Shipping Address : Country(InternalId)', type: 'select'},
          {id: 'shippingaddress.country.name', name: 'Shipping Address : Country (Name)', type: 'select'},
          {id: 'shipcountry', name: 'Shipping Address Country', type: 'select'}]
      );
    });
    test('should return correct formatted netsuite sales order metadata for shipphone id', () => {
      const metadata = [{id: 'shipphone', type: 'select', name: 'billPhone1'}];

      expect(getFormattedNSSalesOrderMetadataData(metadata)).toEqual(
        [{id: 'shipphone', name: 'billPhone1', type: 'select'},
          {id: 'billcountry', name: 'Billing Address Country', type: 'select'},
          {group: 'Body Field', id: 'shippingaddress.addrphone.internalid', name: 'billPhone1', type: 'select'},
          {group: 'Body Field', id: 'shippingaddress.addrphone.name', name: 'billPhone1', type: 'select'},
          {id: 'billingaddress.country.internalid', name: 'Billing Address : Country(InternalId)', type: 'select'},
          {id: 'billingaddress.country.name', name: 'Billing Address : Country (Name)', type: 'select'},
          {id: 'shippingaddress.country.internalid', name: 'Shipping Address : Country(InternalId)', type: 'select'},
          {id: 'shippingaddress.country.name', name: 'Shipping Address : Country (Name)', type: 'select'},
          {id: 'shipcountry', name: 'Shipping Address Country', type: 'select'}]
      );
    });

    test('should return correct formatted netsuite sales order metadata for shipphone id and type is replace', () => {
      const metadata = [{id: 'shipphone', type: 'replace', name: 'billPhone1'}];

      expect(getFormattedNSSalesOrderMetadataData(metadata)).toEqual(
        [{id: 'shipphone', name: 'billPhone1', type: 'replace'},
          {id: 'billcountry', name: 'Billing Address Country', type: 'select'},
          {group: 'Body Field', id: 'shippingaddress.addrphone', name: 'billPhone1', type: 'replace'},
          {id: 'billingaddress.country.internalid', name: 'Billing Address : Country(InternalId)', type: 'select'},
          {id: 'billingaddress.country.name', name: 'Billing Address : Country (Name)', type: 'select'},
          {id: 'shippingaddress.country.internalid', name: 'Shipping Address : Country(InternalId)', type: 'select'},
          {id: 'shippingaddress.country.name', name: 'Shipping Address : Country (Name)', type: 'select'},
          {id: 'shipcountry', name: 'Shipping Address Country', type: 'select'}]
      );
    });
    test('should return correct formatted netsuite sales order metadata for shipzip id and type is replace', () => {
      const metadata = [{id: 'shipzip', type: 'replace', name: 'billPhone1'}];

      expect(getFormattedNSSalesOrderMetadataData(metadata)).toEqual(
        [{id: 'shipzip', name: 'billPhone1', type: 'replace'},
          {id: 'billcountry', name: 'Billing Address Country', type: 'select'},
          {group: 'Body Field', id: 'shippingaddress.zip', name: 'billPhone1', type: 'replace'},
          {id: 'billingaddress.country.internalid', name: 'Billing Address : Country(InternalId)', type: 'select'},
          {id: 'billingaddress.country.name', name: 'Billing Address : Country (Name)', type: 'select'},
          {id: 'shippingaddress.country.internalid', name: 'Shipping Address : Country(InternalId)', type: 'select'},
          {id: 'shippingaddress.country.name', name: 'Shipping Address : Country (Name)', type: 'select'},
          {id: 'shipcountry', name: 'Shipping Address Country', type: 'select'}]
      );
    });
    test('should return correct formatted netsuite sales order metadata for shipoverride id and type is replace', () => {
      const metadata = [{id: 'shipoverride', type: 'replace', name: 'billPhone1'}];

      expect(getFormattedNSSalesOrderMetadataData(metadata)).toEqual(
        [{id: 'billcountry', name: 'Billing Address Country', type: 'select'},
          {group: 'Body Field', id: 'shippingaddress.override', name: 'billPhone1', type: 'replace'},
          {id: 'billingaddress.country.internalid', name: 'Billing Address : Country(InternalId)', type: 'select'},
          {id: 'billingaddress.country.name', name: 'Billing Address : Country (Name)', type: 'select'},
          {id: 'shippingaddress.country.internalid', name: 'Shipping Address : Country(InternalId)', type: 'select'},
          {id: 'shippingaddress.country.name', name: 'Shipping Address : Country (Name)', type: 'select'},
          {id: 'shipcountry', name: 'Shipping Address Country', type: 'select'}]
      );
    });
    test('should return correct formatted netsuite sales order metadata for billcustrecord id and type is replace', () => {
      const metadata = [{id: 'billcustrecord', type: 'replace', name: 'billPhone1'}];

      expect(getFormattedNSSalesOrderMetadataData(metadata)).toEqual(
        [{id: 'billingaddress.custrecord', name: 'billPhone1', type: 'replace'},
          {id: 'billcountry', name: 'Billing Address Country', type: 'select'},
          {id: 'billingaddress.country.internalid', name: 'Billing Address : Country(InternalId)', type: 'select'},
          {id: 'billingaddress.country.name', name: 'Billing Address : Country (Name)', type: 'select'},
          {id: 'shippingaddress.country.internalid', name: 'Shipping Address : Country(InternalId)', type: 'select'},
          {id: 'shippingaddress.country.name', name: 'Shipping Address : Country (Name)', type: 'select'},
          {id: 'shipcountry', name: 'Shipping Address Country', type: 'select'}]
      );
    });
    test('should return correct formatted netsuite sales order metadata for shipcustrecord id and type is replace', () => {
      const metadata = [{id: 'shipcustrecord', type: 'replace', name: 'billPhone1'}];

      expect(getFormattedNSSalesOrderMetadataData(metadata)).toEqual(
        [{id: 'billcountry', name: 'Billing Address Country', type: 'select'},
          {id: 'shippingaddress.custrecord', name: 'billPhone1', type: 'replace'},
          {id: 'billingaddress.country.internalid', name: 'Billing Address : Country(InternalId)', type: 'select'},
          {id: 'billingaddress.country.name', name: 'Billing Address : Country (Name)', type: 'select'},
          {id: 'shippingaddress.country.internalid', name: 'Shipping Address : Country(InternalId)', type: 'select'},
          {id: 'shippingaddress.country.name', name: 'Shipping Address : Country (Name)', type: 'select'},
          {id: 'shipcountry', name: 'Shipping Address Country', type: 'select'}]
      );
    });
    test('should return correct formatted netsuite sales order metadata for shipzip id and type is select', () => {
      const metadata = [{id: 'shipcountry', type: 'select', name: 'billPhone1'}];

      expect(getFormattedNSSalesOrderMetadataData(metadata)).toEqual(
        [{id: 'shipcountry', name: 'billPhone1', type: 'select'},
          {id: 'billcountry', name: 'Billing Address Country', type: 'select'},
          {group: 'Body Field', id: 'shippingaddress.country.internalid', name: 'billPhone1', type: 'select'},
          {group: 'Body Field', id: 'shippingaddress.country.name', name: 'billPhone1', type: 'select'},
          {id: 'billingaddress.country.internalid', name: 'Billing Address : Country(InternalId)', type: 'select'},
          {id: 'billingaddress.country.name', name: 'Billing Address : Country (Name)', type: 'select'},
          {id: 'shipcountry', name: 'Shipping Address Country', type: 'select'}]
      );
    });
    test('should return correct formatted netsuite sales order metadata for shipcountry.name id and type is select', () => {
      const metadata = [{id: 'shipcountry.name', type: 'select', name: 'billPhone1'}];

      expect(getFormattedNSSalesOrderMetadataData(metadata)).toEqual(
        [{id: 'shipcountry', name: 'Shipping Address Country', type: 'text'},
          {id: 'billcountry', name: 'Billing Address Country', type: 'select'},
          {id: 'billingaddress.country.internalid', name: 'Billing Address : Country(InternalId)', type: 'select'},
          {id: 'billingaddress.country.name', name: 'Billing Address : Country (Name)', type: 'select'},
          {id: 'shippingaddress.country.internalid', name: 'Shipping Address : Country(InternalId)', type: 'select'},
          {id: 'shippingaddress.country.name', name: 'Shipping Address : Country (Name)', type: 'select'}]
      );
    });
    test('should return correct formatted netsuite sales order metadata for shipcountry.name id and type is replace', () => {
      const metadata = [{id: 'shipcountry.name', type: 'replace', name: 'billPhone1'}];

      expect(getFormattedNSSalesOrderMetadataData(metadata)).toEqual(
        [{id: 'shipcountry.name', name: 'billPhone1', type: 'replace'},
          {id: 'billcountry', name: 'Billing Address Country', type: 'select'},
          {id: 'billingaddress.country.internalid', name: 'Billing Address : Country(InternalId)', type: 'select'},
          {id: 'billingaddress.country.name', name: 'Billing Address : Country (Name)', type: 'select'},
          {id: 'shippingaddress.country.internalid', name: 'Shipping Address : Country(InternalId)', type: 'select'},
          {id: 'shippingaddress.country.name', name: 'Shipping Address : Country (Name)', type: 'select'}]
      );
    });
    test('should return correct formatted netsuite sales order metadata for billcountry.name id and type is select', () => {
      const metadata = [{id: 'billcountry.name', type: 'select', name: 'billPhone1'}];

      expect(getFormattedNSSalesOrderMetadataData(metadata)).toEqual(
        [{id: 'billcountry', name: 'Billing Address Country', type: 'text'},
          {id: 'billingaddress.country.internalid', name: 'Billing Address : Country(InternalId)', type: 'select'},
          {id: 'billingaddress.country.name', name: 'Billing Address : Country (Name)', type: 'select'},
          {id: 'shippingaddress.country.internalid', name: 'Shipping Address : Country(InternalId)', type: 'select'},
          {id: 'shippingaddress.country.name', name: 'Shipping Address : Country (Name)', type: 'select'},
          {id: 'shipcountry', name: 'Shipping Address Country', type: 'select'}]
      );
    });
    test('should return correct formatted netsuite sales order metadata for billcountry.name id and type is replace', () => {
      const metadata = [{id: 'billcountry.name', type: 'replace', name: 'billPhone1'}];

      expect(getFormattedNSSalesOrderMetadataData(metadata)).toEqual(
        [{id: 'billcountry.name', name: 'billPhone1', type: 'replace'},
          {id: 'billingaddress.country.internalid', name: 'Billing Address : Country(InternalId)', type: 'select'},
          {id: 'billingaddress.country.name', name: 'Billing Address : Country (Name)', type: 'select'},
          {id: 'shippingaddress.country.internalid', name: 'Shipping Address : Country(InternalId)', type: 'select'},
          {id: 'shippingaddress.country.name', name: 'Shipping Address : Country (Name)', type: 'select'},
          {id: 'shipcountry', name: 'Shipping Address Country', type: 'select'}]
      );
    });
  });
});
