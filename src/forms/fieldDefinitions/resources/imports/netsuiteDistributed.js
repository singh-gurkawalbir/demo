export default {
  'netsuite_da.rawOverride': {
    type: 'text',
    label: 'NetSuite_da raw Override',
  },
  'netsuite_da.useRawOverride': {
    type: 'checkbox',
    label: 'NetSuite_da use Raw Override',
    defaultValue: false,
  },
  'netsuite_da.isMigrated': {
    type: 'checkbox',
    label: 'NetSuite_da is Migrated',
    defaultValue: false,
  },
  'netsuite_da.recordIdentifier': {
    type: 'text',
    label: 'NetSuite_da record Identifier',
  },
  'netsuite_da.batchSize': {
    type: 'text',
    label: 'NetSuite_da batch Size',
    validWhen: [
      {
        matchesRegEx: { pattern: '^[\\d]+$', message: 'Only numbers allowed' },
      },
    ],
  },
  'netsuite_da.recordType': {
    type: 'text',
    label: 'NetSuite_da record Type',
  },
  'netsuite_da.operation': {
    type: 'select',
    label: 'NetSuite_da operation',
    options: [
      {
        items: [
          { label: 'Add', value: 'add' },
          { label: 'Update', value: 'update' },
          { label: 'Addupdate', value: 'addupdate' },
        ],
      },
    ],
  },
  'netsuite_da.internalIdLookup.extract': {
    type: 'text',
    label: 'NetSuite_da internal Id Lookup extract',
  },
  'netsuite_da.internalIdLookup.searchField': {
    type: 'text',
    label: 'NetSuite_da internal Id Lookup search Field',
  },
  'netsuite_da.internalIdLookup.operator': {
    type: 'text',
    label: 'NetSuite_da internal Id Lookup operator',
  },
  'netsuite_da.internalIdLookup.expression': {
    type: 'text',
    label: 'NetSuite_da internal Id Lookup expression',
  },
  'netsuite_da.hooks.preMap.fileInternalId': {
    type: 'text',
    label: 'NetSuite_da hooks pre Map file Internal Id',
  },
  'netsuite_da.hooks.preMap.function': {
    type: 'text',
    label: 'NetSuite_da hooks pre Map function',
  },
  'netsuite_da.hooks.preMap.configuration': {
    type: 'text',
    label: 'NetSuite_da hooks pre Map configuration',
  },
  'netsuite_da.hooks.postMap.fileInternalId': {
    type: 'text',
    label: 'NetSuite_da hooks post Map file Internal Id',
  },
  'netsuite_da.hooks.postMap.function': {
    type: 'text',
    label: 'NetSuite_da hooks post Map function',
  },
  'netsuite_da.hooks.postMap.configuration': {
    type: 'text',
    label: 'NetSuite_da hooks post Map configuration',
  },
  'netsuite_da.hooks.postSubmit.fileInternalId': {
    type: 'text',
    label: 'NetSuite_da hooks post Submit file Internal Id',
  },
  'netsuite_da.hooks.postSubmit.function': {
    type: 'text',
    label: 'NetSuite_da hooks post Submit function',
  },
  'netsuite_da.hooks.postSubmit.configuration': {
    type: 'text',
    label: 'NetSuite_da hooks post Submit configuration',
  },
  'netsuite_da.mapping.fields[*].extract': {
    type: 'text',
    label: 'NetSuite_da mapping fields[*] extract',
  },
  'netsuite_da.mapping.fields[*].extractDateFormat': {
    type: 'text',
    label: 'NetSuite_da mapping fields[*] extract Date Format',
  },
  'netsuite_da.mapping.fields[*].extractDateTimezone': {
    type: 'text',
    label: 'NetSuite_da mapping fields[*] extract Date Timezone',
  },
  'netsuite_da.mapping.fields[*].generate': {
    type: 'text',
    label: 'NetSuite_da mapping fields[*] generate',
  },
  'netsuite_da.mapping.fields[*].hardCodedValue': {
    type: 'text',
    label: 'NetSuite_da mapping fields[*] hard Coded Value',
  },
  'netsuite_da.mapping.fields[*].immutable': {
    type: 'text',
    label: 'NetSuite_da mapping fields[*] immutable',
  },
  'netsuite_da.mapping.fields[*].lookupName': {
    type: 'text',
    label: 'NetSuite_da mapping fields[*] lookup Name',
  },
  'netsuite_da.mapping.fields[*].dataType': {
    type: 'text',
    label: 'NetSuite_da mapping fields[*] data Type',
  },
  'netsuite_da.mapping.fields[*].internalId': {
    type: 'text',
    label: 'NetSuite_da mapping fields[*] internal Id',
  },
  'netsuite_da.mapping.fields[*].subRecordMapping': {
    type: 'text',
    label: 'NetSuite_da mapping fields[*] sub Record Mapping',
  },
  'netsuite_da.mapping.fields[*].discardIfEmpty': {
    type: 'text',
    label: 'NetSuite_da mapping fields[*] discard If Empty',
  },
  'netsuite_da.mapping.fields[*].conditional.lookupName': {
    type: 'text',
    label: 'NetSuite_da mapping fields[*] conditional lookup Name',
  },
  'netsuite_da.mapping.fields[*].conditional.when': {
    type: 'text',
    label: 'NetSuite_da mapping fields[*] conditional when',
  },
  'netsuite_da.mapping.lists[*].generate': {
    type: 'text',
    label: 'NetSuite_da mapping lists[*] generate',
  },
  'netsuite_da.mapping.lists[*].jsonPath': {
    type: 'text',
    label: 'NetSuite_da mapping lists[*] json Path',
  },
  'netsuite_da.mapping.lists[*].fields[*].extract': {
    type: 'text',
    label: 'NetSuite_da mapping lists[*] fields[*] extract',
  },
  'netsuite_da.mapping.lists[*].fields[*].extractDateFormat': {
    type: 'text',
    label: 'NetSuite_da mapping lists[*] fields[*] extract Date Format',
  },
  'netsuite_da.mapping.lists[*].fields[*].extractDateTimezone': {
    type: 'text',
    label: 'NetSuite_da mapping lists[*] fields[*] extract Date Timezone',
  },
  'netsuite_da.mapping.lists[*].fields[*].generate': {
    type: 'text',
    label: 'NetSuite_da mapping lists[*] fields[*] generate',
  },
  'netsuite_da.mapping.lists[*].fields[*].hardCodedValue': {
    type: 'text',
    label: 'NetSuite_da mapping lists[*] fields[*] hard Coded Value',
  },
  'netsuite_da.mapping.lists[*].fields[*].immutable': {
    type: 'text',
    label: 'NetSuite_da mapping lists[*] fields[*] immutable',
  },
  'netsuite_da.mapping.lists[*].fields[*].lookupName': {
    type: 'text',
    label: 'NetSuite_da mapping lists[*] fields[*] lookup Name',
  },
  'netsuite_da.mapping.lists[*].fields[*].dataType': {
    type: 'text',
    label: 'NetSuite_da mapping lists[*] fields[*] data Type',
  },
  'netsuite_da.mapping.lists[*].fields[*].internalId': {
    type: 'text',
    label: 'NetSuite_da mapping lists[*] fields[*] internal Id',
  },
  'netsuite_da.mapping.lists[*].fields[*].isKey': {
    type: 'text',
    label: 'NetSuite_da mapping lists[*] fields[*] is Key',
  },
  'netsuite_da.mapping.lists[*].fields[*].subRecordMapping': {
    type: 'text',
    label: 'NetSuite_da mapping lists[*] fields[*] sub Record Mapping',
  },
  'netsuite_da.mapping.lists[*].fields[*].discardIfEmpty': {
    type: 'text',
    label: 'NetSuite_da mapping lists[*] fields[*] discard If Empty',
  },
  'netsuite_da.mapping.lists[*].fields[*].conditional.lookupName': {
    type: 'text',
    label: 'NetSuite_da mapping lists[*] fields[*] conditional lookup Name',
  },
  'netsuite_da.mapping.lists[*].fields[*].conditional.when': {
    type: 'text',
    label: 'NetSuite_da mapping lists[*] fields[*] conditional when',
  },
  'netsuite_da.lookups[*].name': {
    type: 'text',
    label: 'NetSuite_da lookups[*] name',
  },
  'netsuite_da.lookups[*].map': {
    type: 'text',
    label: 'NetSuite_da lookups[*] map',
  },
  'netsuite_da.lookups[*].default': {
    type: 'text',
    label: 'NetSuite_da lookups[*] default',
  },
  'netsuite_da.lookups[*].useDefaultOnMultipleMatches': {
    type: 'text',
    label: 'NetSuite_da lookups[*] use Default On Multiple Matches',
  },
  'netsuite_da.lookups[*].recordType': {
    type: 'text',
    label: 'NetSuite_da lookups[*] record Type',
  },
  'netsuite_da.lookups[*].searchField': {
    type: 'text',
    label: 'NetSuite_da lookups[*] search Field',
  },
  'netsuite_da.lookups[*].expression': {
    type: 'text',
    label: 'NetSuite_da lookups[*] expression',
  },
  'netsuite_da.lookups[*].resultField': {
    type: 'text',
    label: 'NetSuite_da lookups[*] result Field',
  },
  'netsuite_da.lookups[*].includeInactive': {
    type: 'text',
    label: 'NetSuite_da lookups[*] include Inactive',
  },
  'netsuite_da.lookups[*].allowFailures': {
    type: 'text',
    label: 'NetSuite_da lookups[*] allow Failures',
  },
};
