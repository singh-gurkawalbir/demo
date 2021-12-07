import { each } from 'lodash';

import {
  getFormattedNSSalesOrderMetadataData,
  getFormattedNSCustomerSampleData,
  filterSubListProperties,
} from './metadata';

/**
 * converts object representing string to respective objects
 *
 * @params {object} objData
 *
 * @returns {object}
 * @example
 * {'rest.prop':'value'} ->  {rest:{prop:'value'}}
 * {'rest.prop1.prop2':'value'} -> {rest:{prop1:{prop2: 'value'}}}
 * {'prop[*].prop1': 'value1'} -> {prop: [{prop1 : 'value1'}]}
 */

function getFormattedNetsuiteMetadataData(nsMetaData, nsRecordType) {
  const formattedNSMetadata = [];

  each(nsMetaData, metadata => {
    const { sublist, type, id, ...rest } = metadata;
    let formattedID = id;

    if (['_billing_addressbook', '_shipping_addressbook'].includes(sublist)) {
      if (sublist === '_billing_addressbook') {
        formattedID = id.replace(`${sublist}[*].`, '_billingaddress_');
      }

      if (sublist === '_shipping_addressbook') {
        formattedID = id.replace(`${sublist}[*].`, '_shippingaddress_');
      }

      if (type === 'select' && id.indexOf('.') === -1) {
        formattedID += '.name';
      }
    }

    if (type === 'select') {
      if (sublist) {
        if (formattedID.indexOf('.') === formattedID.lastIndexOf('.')) {
          formattedID += '.name';
        }
      } else if (formattedID.indexOf('.') === -1) {
        formattedID += '.name';
      }
    }

    formattedNSMetadata.push({ ...rest, type, id: formattedID });

    if (id === '_billingaddress_state') {
      formattedNSMetadata.push(
        {
          id: '_billingaddress_dropdownstate.internalid',
          name: 'Billing State (InternalId)',
          type: 'select',
        },
        {
          id: '_billingaddress_dropdownstate.name',
          name: 'Billing State (Name)',
          type: 'select',
        }
      );
    } else if (id === '_shippingaddress_state') {
      formattedNSMetadata.push(
        {
          id: '_shippingaddress_dropdownstate.internalid',
          name: 'Shipping State (InternalId)',
          type: 'select',
        },
        {
          id: '_shippingaddress_dropdownstate.name',
          name: 'Shipping State (Name)',
          type: 'select',
        }
      );
    }
  });

  if (nsRecordType === 'salesorder') {
    return getFormattedNSSalesOrderMetadataData(formattedNSMetadata);
  }

  if (nsRecordType === 'customer') {
    return getFormattedNSCustomerSampleData(formattedNSMetadata);
  }

  return formattedNSMetadata;
}

/*
   * Given NS metadata list converts into JSON sample data format
   * Includes business logic of filtering some fields and adding default metadata fields to sample data
   * TODO @Raghu : Could be enhanced further
   */
export const getSuiteScriptNetsuiteRealTimeSampleData = (nsMetaData, nsRecordType) => {
  const nsFormattedMetadata = getFormattedNetsuiteMetadataData(
    nsMetaData,
    nsRecordType
  );

  return filterSubListProperties(nsFormattedMetadata);
};
