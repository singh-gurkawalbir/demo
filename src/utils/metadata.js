/*
 * Utility functions for NS and SF Metadata
 */

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
  const recordId = record.scriptId || record.metadataId || record.internalId;

  return recordId.toLowerCase();
};
