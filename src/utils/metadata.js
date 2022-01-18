/*
 * Utility functions for NS and SF Metadata
 */
import { each, filter, reject } from 'lodash';
import { emptyList } from './constants';

export const isTransactionWSRecordType = recordId => {
  if (!recordId) return false;
  const transactionTypeIds = [
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

  return transactionTypeIds.indexOf(recordId.toLowerCase()) > -1;
};

export const getWSRecordId = record => {
  if (!record) return '';
  const recordId = record.scriptId || record.metadataId || record.internalId;

  return recordId.toLowerCase();
};

const getFormattedNSSalesOrderMetadataData = metadata => {
  const addressFields = [
    'addr1',
    'addr2',
    'addr3',
    'addressee',
    'addressformat',
    'addrphone',
    'attention',
    'city',
    'country',
    'customform',
    'externalid',
    'override',
    'state',
    'zip',
  ];
  const billAddressFields = [];
  const shipAddressFields = [];
  let results = [];
  let field = {};

  each(addressFields, fieldId => {
    if (fieldId === 'addrphone') {
      results = filter(metadata, m => m.id === 'billphone');
    } else {
      results = filter(metadata, m => m.id === `bill${fieldId}`);
    }

    if (results && results.length > 0) {
      [field] = results;

      if (field.type === 'select') {
        billAddressFields.push({
          group: 'Body Field',
          id: `billingaddress.${fieldId}.internalid`,
          name: field.name
            .replace('(Name)', '(InternalId)')
            .replace('Billing', 'Billing Address :'),
          type: field.type,
        });

        billAddressFields.push({
          group: 'Body Field',
          id: `billingaddress.${fieldId}.name`,
          name: field.name.replace('Billing', 'Billing Address :'),
          type: field.type,
        });
      } else {
        billAddressFields.push({
          group: 'Body Field',
          id: `billingaddress.${fieldId}`,
          name: field.name.replace('Billing', 'Billing Address :'),
          type: field.type,
        });
      }
    }

    if (fieldId === 'addrphone') {
      results = filter(metadata, m => m.id === 'shipphone');
    } else {
      results = filter(metadata, m => m.id === `ship${fieldId}`);
    }

    if (results && results.length > 0) {
      [field] = results;

      if (field.type === 'select') {
        shipAddressFields.push({
          group: 'Body Field',
          id: `shippingaddress.${fieldId}.internalid`,
          name: field.name
            .replace('(Name)', '(InternalId)')
            .replace('Shipping', 'Shipping Address :'),
          type: field.type,
        });
        shipAddressFields.push({
          group: 'Body Field',
          id: `shippingaddress.${fieldId}.name`,
          name: field.name.replace('Shipping', 'Shipping Address :'),
          type: field.type,
        });
      } else {
        shipAddressFields.push({
          group: 'Body Field',
          id: `shippingaddress.${fieldId}`,
          name: field.name.replace('Shipping', 'Shipping Address :'),
          type: field.type,
        });
      }
    }
  });

  // eslint-disable-next-line no-param-reassign
  metadata = reject(metadata, field => {
    if (
      [
        'billcountry.internalid',
        'shipcountry.internalid',
        'billcustomform',
        'shipcustomform',
        'billexternalid',
        'shipexternalid',
        'billoverride',
        'shipoverride',
      ].indexOf(field.id) > -1
    ) {
      return true;
    }

    if (field.id.indexOf('billcustrecord') === 0) {
      // eslint-disable-next-line no-param-reassign
      field.id = field.id.replace('bill', 'billingaddress.');
      billAddressFields.push(field);

      return true;
    }
    if (field.id.indexOf('shipcustrecord') === 0) {
      // eslint-disable-next-line no-param-reassign
      field.id = field.id.replace('ship', 'shippingaddress.');
      shipAddressFields.push(field);

      return true;
    }
  });

  results = filter(
    shipAddressFields,
    f => f.id === 'billingaddress.country.internalid'
  );

  if (results && results.length > 0) {
    results[0].type = 'select';
  } else {
    shipAddressFields.push({
      id: 'billingaddress.country.internalid',
      type: 'select',
      name: 'Billing Address : Country(InternalId)',
    });
  }

  results = filter(
    shipAddressFields,
    f => f.id === 'billingaddress.country.name'
  );

  if (results && results.length > 0) {
    if (results[0].type !== 'select') {
      results[0].type = 'select';
      results[0].name += ' (Name)';
    }
  } else {
    shipAddressFields.push({
      id: 'billingaddress.country.name',
      type: 'select',
      name: 'Billing Address : Country (Name)',
    });
  }

  results = filter(
    shipAddressFields,
    f => f.id === 'shippingaddress.country.internalid'
  );

  if (results && results.length > 0) {
    results[0].type = 'select';
  } else {
    shipAddressFields.push({
      id: 'shippingaddress.country.internalid',
      type: 'select',
      name: 'Shipping Address : Country(InternalId)',
    });
  }

  results = filter(
    shipAddressFields,
    f => f.id === 'shippingaddress.country.name'
  );

  if (results && results.length > 0) {
    if (results[0].type !== 'select') {
      results[0].type = 'select';
      results[0].name += ' (Name)';
    }
  } else {
    shipAddressFields.push({
      id: 'shippingaddress.country.name',
      type: 'select',
      name: 'Shipping Address : Country (Name)',
    });
  }

  results = filter(metadata, m => m.id === 'shipcountry.name');

  if (results && results.length > 0) {
    if (results[0].type === 'select') {
      results[0].id = 'shipcountry';
      results[0].type = 'text';
      results[0].name = 'Shipping Address Country';
    }
  } else {
    shipAddressFields.push({
      id: 'shipcountry',
      type: 'select',
      name: 'Shipping Address Country',
    });
  }

  results = filter(metadata, m => m.id === 'billcountry.name');

  if (results && results.length > 0) {
    if (results[0].type === 'select') {
      results[0].id = 'billcountry';
      results[0].type = 'text';
      results[0].name = 'Billing Address Country';
    }
  } else {
    billAddressFields.push({
      id: 'billcountry',
      type: 'select',
      name: 'Billing Address Country',
    });
  }

  // eslint-disable-next-line no-param-reassign
  metadata = metadata.concat(billAddressFields).concat(shipAddressFields);
  // eslint-disable-next-line no-param-reassign
  metadata = metadata.filter(
    el => !['shippingaddress.country', 'billingaddress.country'].includes(el.id)
  );

  return metadata;
};

const getFormattedNSCustomerSampleData = metadata => {
  let results = filter(metadata, m => m.id === 'currency.internalid');

  if (results && results.length > 0) {
    results[0].id = 'primarycurrency.internalid';
  }

  results = filter(metadata, m => m.id === 'currency.name');

  if (results && results.length > 0) {
    results[0].id = 'primarycurrency.name';
  }

  return metadata;
};

export const filterSubListProperties = eFields => {
  if (!eFields) return emptyList;
  let filteredSubLists = [];
  const sublists = [];

  eFields.forEach(field => {
    if (field.id.indexOf('[*].') !== -1) {
      const name = field.id.split('[*].')[0];

      if (sublists.indexOf(name) === -1) {
        sublists.push(name);
      }
    }
  });
  filteredSubLists = eFields.filter(field => {
    const str = /^(.*?)\./.exec(field.id)
      ? /^(.*?)\./.exec(field.id)[1]
      : field.id;

    return sublists.indexOf(str) === -1;
  });

  return filteredSubLists;
};

export function getFormattedNetsuiteMetadataData(nsMetaData, nsRecordType) {
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
 * metadata = { fields: [{name: id1, label: name1, test: 1}, {name: id2, label: name2, test: 2}]}
 * Flattens fields list extracting Objects as { id, name } from each field's name and label
 * @output: [{id: id1, name: name1}, {id: id2, name: name2}]
 */
export const getFormattedSalesForceMetadata = metadata => {
  const formattedSFMetadata = [];
  const { fields = [] } = metadata || {};

  each(fields, field => {
    const { relationshipName, referenceTo = [] } = field;

    if (!relationshipName || !referenceTo.length) {
      formattedSFMetadata.push({
        id: field.name,
        name: field.label,
      });
    }
  });

  return formattedSFMetadata;
};

/*
 * "referencedFields": [
      "CreatedBy.Username",
      "CreatedBy.CompanyName",
      "test1",
      "test2"
    ],
    @output: {
      CreatedBy: { Username: CreatedBy.Username, CompanyName: CreatedBy.CompanyName },
      test1: test1,
      test2: test2
    }
 */
export const getReferenceFieldsMap = (referenceFields = []) => {
  const fieldsToAttach = {};

  each(referenceFields, (field = '') => {
    if (!field) return;
    const fieldSplit = field.split('.');
    const key = fieldSplit[0];

    if (fieldSplit[1]) {
      fieldsToAttach[key] = {
        ...(fieldsToAttach[key] || {}),
        [fieldSplit[1]]: field,
      };
    } else {
      fieldsToAttach[key] = key;
    }
  });

  return fieldsToAttach;
};
