import { times } from 'lodash';

const getSampleSQLTemplate = (sampleData, eFields, isInsert) => {
  let toReturn = '';

  if (eFields && eFields.length > 0 && Array.isArray(sampleData)) {
    if (isInsert) {
      toReturn = `${'Insert into Employee(id) Values({{data.0.'}${
        eFields[0].id
      }}})`;
    } else {
      toReturn = `${'Update Employee SET name={{data.0.'}${
        eFields[0].id
      }}} where id ={{data.0.${eFields[0].id}}}`;
    }
  } else if (eFields && eFields.length > 0) {
    if (isInsert) {
      toReturn = `${'Insert into Employee(id) Values({{data.'}${
        eFields[0].id
      }}})`;
    } else {
      toReturn = `${'Update Employee SET name={{data.'}${
        eFields[0].id
      }}} where id ={{data.${eFields[0].id}}}`;
    }
  }

  return toReturn;
};

const getSampleMongoDbTemplate = (sampleData, eFields, isInsert) => {
  let toReturn = '{\n';

  if (!isInsert) {
    toReturn += '"$set":{\n';
  }

  if (
    sampleData &&
    Array.isArray(sampleData) &&
    sampleData.length > 0 &&
    Array.isArray(sampleData[0])
  ) {
    const headerFields = [];
    const listFields = [];

    Object.keys(sampleData[0][0]).forEach(prop => {
      const val = sampleData[0][0][prop];
      let notHeader = false;

      sampleData[0].forEach(obj => {
        if (obj[prop] !== val) {
          notHeader = true;
        }
      });

      notHeader ? listFields.push(prop) : headerFields.push(prop);
    });
    times(headerFields.length > 4 ? 5 : headerFields.length, i => {
      const value = /\s/.test(headerFields[i])
        ? `[${headerFields[i]}]`
        : headerFields[i];

      toReturn += `  "${headerFields[i]}":"{{data.0.${value}}}",\n`;
    });
  } else {
    const nonSubFields = eFields.filter(
      field => field && field.id && field.id.indexOf('[*].') === -1
    );

    times(nonSubFields.length > 4 ? 5 : nonSubFields.length, i => {
      const value = /\s/.test(nonSubFields[i].id)
        ? `[${nonSubFields[i].id}]`
        : nonSubFields[i].id;

      toReturn += `  "${nonSubFields[i].id}":"{{data.${value}}}",\n`;
    });
  }

  toReturn = toReturn.replace(/,\n$/, '');

  if (!isInsert) {
    toReturn += '  },\n';
    toReturn += '"$unset":{}';
  }

  toReturn += '\n}\n';

  return toReturn;
};

export default {
  getSampleSQLTemplate,
  getSampleMongoDbTemplate,
};
