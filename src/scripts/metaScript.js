/* import fs from 'fs';
import stringify from 'code-stringify';
import http from '../forms/definitions/connections/custom/http';

const basePath =
  '/Users/suryavamsivemparala/workspace/git/suryaVemp/integrator/integrator-ui/src/forms/definitions/connections/custom/http';
const convertFieldsToFieldReferneceObj = (acc, curr) => {
  if (!curr.fieldId && !curr.id && !curr.formId) {
    throw new Error('No fieldId , id or formId', curr);
  }

  if (curr.fieldId) acc[curr.fieldId] = curr;
  else if (curr.id) acc[curr.id] = curr;
  else if (curr.formId) acc[curr.formId] = curr;
  else throw new Error('could not find any of the props');

  // !curr.formId
  return acc;
};

const refGeneration = field => {
  const { fieldId, id, formId } = field;

  if (fieldId) return fieldId;
  else if (id) return id;
  else if (formId) return formId;
  throw new Error('cant generate reference');
};

// get a particular component
const generatefieldMap = data => {
  const finalData = data;

  // if there are no fields and fieldSets
  if (!data.fields && !data.fieldSets)
    throw new Error(
      `something wrong with meta no fields ${JSON.stringify(data)}`
    );
  finalData.fieldMap = data.fields.reduce(convertFieldsToFieldReferneceObj, {});
  finalData.layout = {};

  // formId
  finalData.layout.fields = data.fields.map(refGeneration);

  if (finalData.fieldSets && finalData.fieldSets.length > 0) {
    finalData.fieldSets.forEach(fieldSet => {
      fieldSet.fields.reduce(
        convertFieldsToFieldReferneceObj,
        finalData.fieldMap
      );
    });
    finalData.layout.type = 'collapse';
    finalData.layout.containers = finalData.fieldSets.map(fieldSet => ({
      collapsed: fieldSet.collapsed,
      label: fieldSet.header,
      fields: fieldSet.fields.map(refGeneration),
    }));
  }

  // deepClone is ignoring root function properties
  if (data.preSubmit) finalData.preSave = data.preSubmit;
  delete finalData.fields;
  delete finalData.fieldSets;
  delete finalData.preSubmit;

  return { fieldMap: finalData.fieldMap, layout: finalData.layout };
};

// Object.keys(http).forEach(key => {
try {
  // if (resources[key] && (resources[key].fields || resources[key].fieldSets)) {
  const data = generatefieldMap(obj);
  // const transformedMeta = stringify(data);
  const transformedMeta = JSON.stringify(data);

  // remove "" in stringified functions
  // transformedMeta = transformedMeta.replace(
  //   /(.*):"(.*?)=>(.*?)"/,
  //   '$1:$2=>$3'
  // );
  // not working
  // transformedMeta = `export default ${transformedMeta};`;
  console.log('result', transformedMeta);
  // fs.appendFileSync(`${basePath}${http}.js`, transformedMeta);
  // }
} catch (e) {
  // eslint-disable-next-line no-console
  // console.log('for key ', key);
  // eslint-disable-next-line no-console
  console.log('error generated ', e);
}
// });
*/
