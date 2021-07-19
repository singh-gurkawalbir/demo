import { COMM_STATES } from '../../reducers/comms/networkComms';
import { AFE_SAVE_STATUS, FORM_SAVE_STATUS } from '../constants';

export const FLOW_STAGES = [
  'outputFilter',
  'exportFilter',
  'inputFilter',
  'transform',
  'sampleResponse',
  'importMappingExtract',
];
export const HOOK_STAGES = [
  'postResponseMapHook',
  'preSavePage',
  'preMap',
  'postMap',
  'postSubmit',
  'postAggregate',
  'contentBasedFlowRouter',
  'handleRequest',
];

export const getEditorStatus = saveStatus => {
  switch (saveStatus) {
    case AFE_SAVE_STATUS.SUCCESS: return FORM_SAVE_STATUS.COMPLETE;
    case AFE_SAVE_STATUS.REQUESTED: return FORM_SAVE_STATUS.LOADING;
    default: return FORM_SAVE_STATUS.FAILED;
  }
};
export const getFormSaveStatusFromCommStatus = resourceCommStatus => {
  switch (resourceCommStatus) {
    case COMM_STATES.SUCCESS: return FORM_SAVE_STATUS.COMPLETE;
    case COMM_STATES.LOADING: return FORM_SAVE_STATUS.LOADING;
    default: return FORM_SAVE_STATUS.FAILED;
  }
};

export function dataAsString(data) {
  return typeof data === 'string'
    ? data
    : JSON.stringify(data, null, 2);
}

export const getUniqueFieldId = (fieldId, resource) => {
  if (!fieldId) { return ''; }
  const { ignoreExisting, ignoreMissing } = resource || {};

  // some field types have same field ids
  switch (fieldId) {
    case 'rdbms.query1':
      return 'rdbms.query';
    case 'rdbms.query2':
      return 'rdbms.query';
    case 'rdbms.queryInsert':
      return 'rdbms.query.1';
    case 'rdbms.queryUpdate':
      return 'rdbms.query.0';
    case 'http.bodyCreate':
      if (ignoreExisting || ignoreMissing) { return 'http.body'; }

      return 'http.body.1';

    case 'http.bodyUpdate':
      if (ignoreExisting || ignoreMissing) { return 'http.body'; }

      return 'http.body.0';
    case 'http.relativeURIUpdate':
      if (ignoreExisting || ignoreMissing) { return 'http.relativeURI'; }

      return 'http.relativeURI.0';
    case 'http.relativeURICreate':
      if (ignoreExisting || ignoreMissing) { return 'http.relativeURI'; }

      return 'http.relativeURI.1';

    default:
      return fieldId;
  }
};

// DO NOT DELETE below utils
// This file is unused right now but we might need
// this logic later when a sample template needs to be shown
// for HTTP body editor
// import { times } from 'lodash';
// import getJSONPaths from '../../../utils/jsonPaths';

// export function getJSONSampleTemplate(data) {
//   let toReturn = '';
//   const eFields =
//     data && Array.isArray(data)
//       ? getJSONPaths(data[0], null, { wrapSpecialChars: true })
//       : [];

//   toReturn += '{{#each data}}\n';
//   toReturn += '{{#if @index}} , {{/if}}\n';
//   toReturn += '{\n';

//   if (Array.isArray(data) && Array.isArray(data[0])) {
//     const headerFields = [];
//     const listFields = [];
//     const previewData = data;

//     Object.keys(previewData[0][0]).forEach(prop => {
//       const val = previewData[0][0][prop];
//       let notHeader = false;

//       previewData[0].forEach(obj => {
//         if (obj[prop] !== val) {
//           notHeader = true;
//         }
//       });
//       notHeader ? listFields.push(prop) : headerFields.push(prop);
//     });
//     times(headerFields.length > 4 ? 5 : headerFields.length, i => {
//       const value = /\s/.test(headerFields[i])
//         ? `[${headerFields[i]}]`
//         : headerFields[i];

//       toReturn += `  "${headerFields[i]}":"{{this.0.${value}}}",\n`;
//     });

//     if (listFields.length) {
//       toReturn += '  "Lines": [\n';
//       toReturn += '  {{#each this}}\n';
//       toReturn += '  {{#if @index}} , {{/if}}\n';
//       toReturn += '  {\n';
//       times(listFields.length > 4 ? 5 : listFields.length, i => {
//         const value = /\s/.test(listFields[i])
//           ? `[${listFields[i]}]`
//           : listFields[i];

//         toReturn += `    "${listFields[i]}":"{{${value}}}",\n`;
//       });
//       toReturn += '  }\n';
//       toReturn += '  {{/each}}\n';
//       toReturn += '  ]';
//     }
//   } else {
//     const nonSubFields = eFields.filter(
//       field => field.id.indexOf('[*].') === -1
//     );

//     times(nonSubFields.length > 4 ? 5 : nonSubFields.length, i => {
//       const value = /\s/.test(nonSubFields[i].id)
//         ? `[${nonSubFields[i].id}]`
//         : nonSubFields[i].id;

//       toReturn += `  "${nonSubFields[i].id}":"{{${value}}}",\n`;
//     });
//     const subFields = eFields.filter(field => field.id.indexOf('[*].') !== -1);

//     if (subFields.length >= 1) {
//       const sublistName = subFields[0].id.split('[*].')[0];

//       toReturn += `  "${subFields[0].id.split('[*].')[0]}":\n`;
//       toReturn += '  [';
//       toReturn += `  {{#each ${sublistName}}}\n`;
//       toReturn += '  {{#if @index}} , {{/if}}';
//       toReturn += '  {\n';
//       const sublistCount = subFields.length > 4 ? 5 : subFields.length;

//       times(sublistCount, i => {
//         toReturn += `    "${subFields[i].id.split('[*].')[1]}":"{{${
//           subFields[i].id.split('[*].')[1]
//         }}}"${i === sublistCount - 1 ? '' : ','}\n`;
//       });
//       toReturn += '  }\n';
//       toReturn += '  {{/each}}\n';
//       toReturn += '  ],\n';
//     }

//     toReturn = toReturn.replace(/,\n$/, '');
//     toReturn += '\n}\n';
//     toReturn += '{{/each}}\n';
//   }

//   return toReturn;
// }

// export function getXMLSampleTemplate(data) {
//   let toReturn = '';
//   let subFields;

//   toReturn += '<?xml version="1.0" encoding="UTF-8"?>\n';
//   toReturn += '<data>\n';
//   toReturn += '{{#each data}}\n';

//   if (data) {
//     const eFields = Array.isArray(data)
//       ? getJSONPaths(data[0], null, {
//         wrapSpecialChars: true,
//       })
//       : [];

//     if (Array.isArray(data) && Array.isArray(data[0])) {
//       toReturn += '  <record id="{{this.0.id}}">\n';
//       const headerFields = [];
//       const listFields = [];
//       const previewData = data;

//       Object.keys(previewData[0][0]).forEach(prop => {
//         const val = previewData[0][0][prop];
//         let notHeader = false;

//         previewData[0].forEach(obj => {
//           if (obj[prop] !== val) {
//             notHeader = true;
//           }
//         });
//         notHeader ? listFields.push(prop) : headerFields.push(prop);
//       });
//       times(headerFields.length > 4 ? 5 : headerFields.length, i => {
//         const str = headerFields[i].replace(/\s/g, '').replace(/^\[|]$/g, ''); // remove spaces and wrapped square braces for the xml node.
//         const value = /\W/.test(headerFields[i])
//           ? `[${headerFields[i]}]`
//           : headerFields[i];

//         toReturn += `    <${str}>{{this.0.${value}}}</${str}>\n`;
//       });
//       toReturn += '    <sublists>\n';
//       toReturn += '    {{#each this}}\n';
//       toReturn += '      <sublist>\n';
//       times(listFields.length > 4 ? 5 : listFields.length, i => {
//         const str = listFields[i].replace(/\s/g, '').replace(/^\[|]$/g, ''); // remove spaces and wrapped square braces for the xml node.
//         const value = /\W/.test(listFields[i])
//           ? `[${listFields[i]}]`
//           : listFields[i];

//         toReturn += `        <${str}>{{${value}}}</${str}>\n`;
//       });
//       toReturn += '      </sublist>\n';
//       toReturn += '    {{/each}}\n';
//       toReturn += '    </sublists>\n';
//     } else {
//       toReturn += '  <record id="{{id}}">\n';
//       const nonSubFields = eFields.filter(
//         field => field.id.indexOf('[*].') === -1
//       );

//       times(nonSubFields.length > 4 ? 5 : nonSubFields.length, i => {
//         toReturn += `    <${nonSubFields[i].id
//           .replace(/\s/g, '')
//           .replace(/^\[|]$/g, '')}>{{${nonSubFields[i].id}}}</${nonSubFields[
//           i
//         ].id
//           .replace(/\s/g, '')
//           .replace(/^\[|]$/g, '')}>\n`; // remove spaces and wrapped square braces for the xml node.
//       });
//       subFields = eFields.filter(field => field.id.indexOf('[*].') !== -1);

//       if (subFields.length > 1) {
//         const sublistName = subFields[0].id.split('[*].')[0];

//         toReturn += `    <${subFields[0].id.split('[*].')[0]}>\n`;
//         toReturn += `      {{#each ${sublistName} as |a|}}\n`;
//         const subRecordName = /s$/.test(sublistName)
//           ? sublistName.replace(/s$/, '')
//           : 'sublist';

//         toReturn += `        <${subRecordName}>\n`;
//         times(subFields.length > 4 ? 5 : subFields.length, i => {
//           toReturn += `          <${subFields[i].id.split('[*].')[1]}>{{${
//             subFields[i].id.split('[*].')[1]
//           }}}</${subFields[i].id.split('[*].')[1]}>\n`;
//         });
//         toReturn += `        </${subRecordName}>\n`;
//         toReturn += '      {{/each}}\n';
//         toReturn += `    </${subFields[0].id.split('[*].')[0]}>\n`;
//       }
//     }
//   }

//   toReturn += '  </record>\n';
//   toReturn += '{{/each}}\n';
//   toReturn += '</data>\n';

//   return toReturn;
// }
