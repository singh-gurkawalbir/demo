import fs from 'fs';
import { join } from 'path';
import fileread from './util/index';
import componentFactory from './formComponentsMeta/componentFactory';

// ignore fields
// which is that or ends with it
// ignoring editor specific fields as well like
// 'helpText',
// 'position',
// 'required',
// 'label',
// 'type' is from wrapper
const ignoreFields = [
  'createdAt',
  'lastModified',
  'value',
  'deletedAt',
  'sandbox',
  'debugDate',
  'externalId',
  'offline',
  'externalId',
];
const ignoreFieldsOfEndingSubpaths = [
  'helpText',
  'position',
  'required',
  'label',
  'type',
  '_id', // Moongoose generated id
  '_iClientId', // Rest Connection
];
const ignoreFieldsThatEndsWith = ['_salt', '[*].value'];
const commonFields = data =>
  Object.keys(data).filter(key => {
    const splits = key.split('.');

    return splits.length === 1;
  });
const formSpecificFields = (formName, data) =>
  Object.keys(data).filter(key => {
    const splits = key.split('.');

    return splits[0] === formName;
  });
const getAllFormSpecificResources = data => {
  const allResources = Object.keys(data)
    .map(key => {
      const splits = key.split('.');

      return splits.length > 1 && splits[0];
    })
    .filter(key => key);
  const uniqueResources = new Set(allResources);

  return [...uniqueResources];
};

const applyOurSpecificFilterRules = fields =>
  fields.filter(foundFieldDefs => {
    const splitValues = foundFieldDefs.split('.');
    const lastSubPath = splitValues[splitValues.length - 1];

    if (splitValues.length === 1) {
      if (lastSubPath[0] === '_' || lastSubPath[0] === '__') return false;

      return !ignoreFields.includes(lastSubPath);
    }

    const isIncludingLastSubpath = ignoreFieldsOfEndingSubpaths.includes(
      lastSubPath
    );
    const isEndingWithIgnoreFields = ignoreFieldsThatEndsWith
      .map(field => foundFieldDefs.endsWith(field))
      .reduce((prevValue, currValue) => prevValue || currValue, false);

    return !(isIncludingLastSubpath || isEndingWithIgnoreFields);
  });
const applyFiltersForAForm = (formName, data) => {
  const consolidatedFieldsForAForm = [
    ...commonFields(data),
    ...formSpecificFields(formName, data),
  ];
  const transformedItToAddPath = applyOurSpecificFilterRules(
    consolidatedFieldsForAForm
  ).map(key => ({ pathGeneratedFromObj: key, ...data[key] }));

  return transformedItToAddPath;
};

// const getCompleteHashOfFields = data => {
//   const allResources = getAllFormSpecificResources.map(resource => {
//     formSpecificFields(resource, data);
//   });
//   const consolidatedFields = [...commonFields(data), ...allResources];
//   const transformedItToAddPath = applyOurSpecificFilterRules(
//     consolidatedFields
//   ).map(key => ({ pathGeneratedFromObj: key, ...data[key] }));

//   return transformedItToAddPath;
// };

const transformFieldsToMatchingComponent = (field, resourceType) => {
  const component = componentFactory(field, resourceType);
  const wrappedComponent = {};

  wrappedComponent[component.id] = component;

  return wrappedComponent;
};

const commonFieldsComponents = (data, resourceType) => {
  const commonFieldsArr = [...commonFields(data)];

  applyOurSpecificFilterRules(commonFieldsArr)
    .map(key => ({ pathGeneratedFromObj: key, ...data[key] }))
    .map(field => transformFieldsToMatchingComponent(field, resourceType))
    .forEach(transformedField => {
      const str = JSON.stringify(transformedField);
      const finalStr = str.slice(1, str.length - 1);

      console.log(`${finalStr},`);
    });
};

const generateFieldSetsHeader = formMeta =>
  formMeta.reduce(
    (acc, obj) => {
      // i dont like this at all {sdsd:{"dsds":"sdd"}}
      const keys = Object.keys(obj);
      const id = keys[0];
      const currValue = obj[id];
      const splitValues = currValue.helpKey.split('.');

      // ignore first two
      // less than equal 3 mean goes into the fields
      // greater than 3 means there are collapsable section
      if (splitValues.length <= 3) {
        acc.fields.push({ id });
      } else {
        const headerName = splitValues[2];
        const foundHeaderArray = acc.fieldSets.filter(
          set => set.header === headerName
        );
        // i dont like this... filter gives back an array
        const foundHeader = foundHeaderArray[0];

        if (foundHeader) {
          foundHeader.fields.push({ id });
        } else {
          acc.fieldSets.push({
            header: headerName,
            collapsed: false,
            fields: [{ id }],
          });
        }
      }

      return acc;
    },
    { fields: [], fieldSets: [] }
  );
const resourceType = 'export';
const folderToDumpGeneratedViewFiles = `/Users/suryavamsivemparala/workspace/git/suryaVemp/integrator/integrator-ui/src/formsMetadata/generatedHash/resourceViews/${resourceType}s/`;
const generateIndexFiles = data => {
  let str = '';

  getAllFormSpecificResources(data).forEach(form => {
    str += `import from "./${form}";\n`;
  });

  str += '\n';
  str += 'export default {\n';
  getAllFormSpecificResources(data).forEach(form => {
    str += `${form},\n`;
  });

  str += '};';

  fs.writeFileSync(`${folderToDumpGeneratedViewFiles}index.js`, str);
};

const gererateMatchingComponentsWithCollapsableComments = (
  data,
  resourceType
) => {
  console.log(`export default {`);

  console.log(`//#region common`);
  commonFieldsComponents(data, resourceType);
  console.log(`//#endregion common`);
  getAllFormSpecificResources(data).forEach(resource => {
    console.log(`//#region ${resource}`);

    const formFields = applyOurSpecificFilterRules(
      formSpecificFields(resource, data)
    ).map(key => ({ pathGeneratedFromObj: key, ...data[key] }));

    formFields
      .map(field => transformFieldsToMatchingComponent(field, resourceType))
      .forEach(transformedField => {
        const str = JSON.stringify(transformedField);
        const finalStr = str.slice(1, str.length - 1);

        console.log(`${finalStr},`);
      });
    console.log(`//#endregion ${resource}`);
  });

  generateIndexFiles(data);
  console.log(`}; `);
};

// writing to "view" files...be extremely carefull of this part of the script
// changes will be overwritten
const gererateMatchingComponents = (data, resourceType) => {
  getAllFormSpecificResources(data).forEach(form => {
    console.log(`comp data ${JSON.stringify(data)}`);
    const allConnectionFields = applyFiltersForAForm(form, data).map(field =>
      transformFieldsToMatchingComponent(field, resourceType)
    );

    console.log(`check ${JSON.stringify(allConnectionFields)}`);
    let connectionMeta = JSON.stringify(
      generateFieldSetsHeader(allConnectionFields)
    );

    connectionMeta = `export default ${connectionMeta};`;

    fs.writeFileSync(
      `${folderToDumpGeneratedViewFiles}${form}.js`,
      connectionMeta
    );
  });
};

const schemaFile = `${resourceType}Schema.txt`;
const data = fileread(join(__dirname, '..', schemaFile));

gererateMatchingComponentsWithCollapsableComments(data, resourceType);
gererateMatchingComponents(data, resourceType);
