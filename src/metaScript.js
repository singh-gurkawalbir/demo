import fs from 'fs';
import { deepClone } from 'fast-json-patch';
import connections from './forms/definitions/connections';

// const fileread = filename => {
//   const contents = fs.readFileSync(filename);

//   return JSON.parse(contents.toString());
// };

// const data = fileread(join(__dirname, '..', schemaFile));
const convertFieldsToFieldReferneceObj = (acc, curr) => {
  if (!curr.fieldId && !curr.id) {
    throw new Error('No fieldId or id', curr);
  }

  if (curr.fieldId) acc[curr.fieldId] = curr;
  else acc[curr.id] = curr;

  return acc;
};

// get a particular component
const generateFieldReferences = data => {
  console.log(`comp data ${JSON.stringify(data)}`);
  const finalData = deepClone(data);

  finalData.fieldReferences = data.fields.reduce(
    convertFieldsToFieldReferneceObj,
    {}
  );
  finalData.layout = {};
  finalData.layout.fields = data.fields.map(field =>
    field.fieldId ? field.fieldId : field.id
  );

  if (finalData.fieldSets) {
    finalData.fieldSets.forEach(fieldSet => {
      fieldSet.fields.reduce(
        convertFieldsToFieldReferneceObj,
        finalData.fieldReferences
      );
    });
    finalData.layout.containers = finalData.fieldSets.map(fieldSet => ({
      type: 'collapse',
      fieldSets: [
        {
          label: fieldSet.heading,
          fields: fieldSet.fields.map(field =>
            field.fieldId ? field.fieldId : field.id
          ),
        },
      ],
    }));
  }

  finalData;
};

const basePath =
  '/Users/suryavamsivemparala/workspace/git/suryaVemp/integrator/integrator-ui/src/forms/definitions/connections/sample/';

Object.keys(connections).forEach(key => {
  const data = generateFieldReferences(connections[key]);
  let transferedMeta = JSON.stringify(data, (key, val) =>
    typeof val === 'function' ? `${val}` : val
  );

  transferedMeta = `export default ${transferedMeta};`;

  fs.writeFileSync(`${basePath}${key}.js`, transferedMeta);
});
