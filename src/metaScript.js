import fs from 'fs';
import { deepClone } from 'fast-json-patch';
import connections from './forms/definitions/connections';

// const fileread = filename => {
//   const contents = fs.readFileSync(filename);

//   return JSON.parse(contents.toString());
// };

// const data = fileread(join(__dirname, '..', schemaFile));
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
const generateFieldReferences = data => {
  const finalData = deepClone(data);

  // if there are no fields or fieldSets
  if (!data.fields || !data.fieldSets)
    throw new Error(
      `something wrong with meta no fields ${JSON.stringify(data)}`
    );
  finalData.fieldReferences = data.fields.reduce(
    convertFieldsToFieldReferneceObj,
    {}
  );
  finalData.layout = {};

  // formId
  finalData.layout.fields = data.fields.map(refGeneration);

  if (finalData.fieldSets) {
    finalData.fieldSets.forEach(fieldSet => {
      fieldSet.fields.reduce(
        convertFieldsToFieldReferneceObj,
        finalData.fieldReferences
      );
    });
    finalData.layout.containers = finalData.fieldSets.map(fieldSet => ({
      type: 'collapse',
      // collapse true false
      fieldSets: [
        {
          collapse: fieldSet.collapse,
          label: fieldSet.heading,
          fields: fieldSet.fields.map(refGeneration),
        },
      ],
    }));
  }

  return finalData;
};

const basePath =
  '/Users/suryavamsivemparala/workspace/git/suryaVemp/integrator/integrator-ui/src/forms/definitions/connections/sample/';

Object.keys(connections).forEach(key => {
  const data = generateFieldReferences(connections[key]);
  let transferedMeta = JSON.stringify(data, (key, val) => {
    if (typeof val === 'function') {
      return val;
    }

    return val;
  });

  transferedMeta = `export default ${transferedMeta};`;

  fs.writeFileSync(`${basePath}${key}.js`, transferedMeta);
});
