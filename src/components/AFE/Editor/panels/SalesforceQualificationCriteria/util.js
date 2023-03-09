/* eslint-disable no-useless-escape */
import { filter, isEmpty, uniqBy } from 'lodash';
// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';

/* eslint-disable no-param-reassign */
const updateRulesForSOQL = (dataIn = { rules: [] }) => {
  const referenceFieldsUsed = [];

  dataIn.rules.forEach(r => {
    if (r.rules && r.rules.length > 0) {
      updateRulesForSOQL(r);
    } else if (
      ['equal', 'not_equal'].indexOf(r.operator) > -1 &&
      r.value === null
    ) {
      r.operator = r.operator === 'equal' ? 'is_null' : 'is_not_null';
    }

    if (r.id && r.id.indexOf('.') > -1) {
      referenceFieldsUsed.push(r.id);
    }
  });

  return referenceFieldsUsed;
};
/* eslint-enable no-param-reassign */

export function convertSalesforceQualificationCriteria(_sql, queryBuilder) {
  let rules;
  let referenceFieldsUsed;
  let sql = _sql;

  if (sql) {
    /*
     * For datetime and date, we need to enclose the values in ''
     * Supported Date Formats - YYYY-MM-DD
     * Supported DateTime Formats - YYYY-MM-DDThh:mm:ss.sss+hhmm, YYYY-MM-DDThh:mm:ss.sss-hhmm, YYYY-MM-DDThh:mm:ss+hh:mm, YYYY-MM-DDThh:mm:ss-hh:mm, YYYY-MM-DDThh:mm:ssZ
     */
    sql = sql.replace(
      /\d{4}-\d{2}-\d{2}\T\d{2}:\d{2}:\d{2}\.\d{3}[+,-]\d{4}/g,
      dt => `'${dt}'`
    );
    sql = sql.replace(
      /\d{4}-\d{2}-\d{2}\T\d{2}:\d{2}:\d{2}[+,-]\d{2}:\d{2}/g,
      dt => `'${dt}'`
    );
    sql = sql.replace(
      /\d{4}-\d{2}-\d{2}\T\d{2}:\d{2}:\d{2}Z/g,
      dt => `'${dt}'`
    );
    sql = sql.replace(/\d{4}-\d{2}-\d{2}(?!T)/g, dt => `'${dt}'`);
    try {
      // try to get the rules from the given sql text
      rules = jQuery(queryBuilder).queryBuilder('getRulesFromSQL', sql);
    } catch (e) {
      // if enable to extract return the error message
      return { error: e.message };
    }
    referenceFieldsUsed = updateRulesForSOQL(rules);
  }

  return { rules, referenceFieldsUsed };
}

const getFilterTypeAndOperators = field => {
  let type;

  if (field && field.type) {
    switch (field.type) {
      case 'int':
        type = 'integer';
        break;
      case 'currency':
      case 'percent':
        type = 'double';
        break;
      default:
        ({ type } = field);
    }
  }

  if (
    ![
      'string',
      'integer',
      'double',
      'date',
      'time',
      'datetime',
      'boolean',
    ].includes(type)
  ) {
    type = 'string';
  }

  let operators = [
    'equal',
    'not_equal',
    'in',
    'not_in',
    'less',
    'less_or_equal',
    'greater',
    'greater_or_equal',
    'begins_with',
    'contains',
    'ends_with',
    'is_empty',
    'is_not_empty',
    'is_null',
    'is_not_null',
  ];

  if (['integer', 'double'].includes(type)) {
    operators = [
      'equal',
      'not_equal',
      'less',
      'less_or_equal',
      'greater',
      'greater_or_equal',
      'is_null',
      'is_not_null',
    ];
  }

  return { type, operators };
};

function getFilterConfig(field, options = {}) {
  const config = getFilterTypeAndOperators(field);
  const filter = {
    id: field.id,
    label: field.label,
    type: config.type,
    operators: config.operators,
  };

  if (options) {
    if (options.relationshipName) {
      filter.id = [options.relationshipName, filter.id].join('.');
      filter.label = [options.relationshipName, filter.label].join('.');
    }
  }

  if (field.type === 'boolean') {
    filter.type = 'boolean';
    filter.input = 'radio';
    filter.values = {
      true: 'Yes',
      false: 'No',
    };
    filter.operators = ['equal'];
  } else if (
    field.type === 'picklist' &&
    field.picklistValues &&
    field.picklistValues.length > 0
  ) {
    filter.input = 'select';
    filter.multiple = true;
    filter.operators = [
      'equal',
      'not_equal',
      'in',
      'not_in',
      'less',
      'less_or_equal',
      'greater',
      'greater_or_equal',
      'is_empty',
      'is_not_empty',
      'is_null',
      'is_not_null',
    ];
    filter.values = {};
    field.picklistValues.forEach(pl => {
      filter.values[pl.value] = pl.label || pl.value;
    });
  }

  return filter;
}

export function getFilterList(jsonPaths, rules) {
  function iterate(r) {
    r.rules.forEach(rr => {
      if (rr.condition) {
        iterate(rr);
      } else {
        let { id } = rr;

        if (!id) {
          if (jsonPaths.length === 0) {
            jsonPaths.push({ id: 'sampleField', name: 'sampleField' });
          }

          id = jsonPaths[0].id;
        }

        if (!filter(jsonPaths, { id }).length) {
          jsonPaths.push({ id });
        }

        if (rr.rhs && rr.rhs.type === 'field' && rr.rhs.field) {
          if (!filter(jsonPaths, { id: rr.rhs.field }).length) {
            jsonPaths.push({ id: rr.rhs.field });
          }
        }
      }
    });
  }

  if (rules?.rules?.length > 0) {
    iterate(rules);
  }

  if (jsonPaths.length === 0) {
    jsonPaths.push({ id: 'sampleField', name: 'sampleField' });
  }

  return jsonPaths;
}

export function validateFilterRule(queryBuilder) {
  return jQuery(queryBuilder).queryBuilder('validate');
}

export function getSQL(queryBuilder) {
  const result = jQuery(queryBuilder).queryBuilder('getSQL');

  if (isEmpty(result) || !result.sql) {
    return undefined;
  }

  /*
   * For datetime and date fields, we need to remove enclosing ''
   * Supported Date Formats - YYYY-MM-DD
   * Supported DateTime Formats - YYYY-MM-DDThh:mm:ss.sss+hhmm, YYYY-MM-DDThh:mm:ss.sss-hhmm, YYYY-MM-DDThh:mm:ss+hh:mm, YYYY-MM-DDThh:mm:ss-hh:mm, YYYY-MM-DDThh:mm:ssZ
   */
  result.sql = result.sql.replace(
    /'\d{4}-\d{2}-\d{2}\T\d{2}:\d{2}:\d{2}\.\d{3}[+,-]\d{4}'/g,
    dt => dt.replace(/'/g, '')
  );
  result.sql = result.sql.replace(
    /'\d{4}-\d{2}-\d{2}\T\d{2}:\d{2}:\d{2}[+,-]\d{2}:\d{2}'/g,
    dt => dt.replace(/'/g, '')
  );
  result.sql = result.sql.replace(
    /'\d{4}-\d{2}-\d{2}\T\d{2}:\d{2}:\d{2}Z'/g,
    dt => dt.replace(/'/g, '')
  );
  result.sql = result.sql.replace(/'\d{4}-\d{2}-\d{2}(?!T)'/g, dt =>
    dt.replace(/'/g, '')
  );

  return result.sql;
}

export function getAllFiltersConfig(filtersMetadata = [], referenceFields) {
  const referencedFields = referenceFields.map(f => {
    if (typeof f === 'string') { return { id: f, label: f }; }

    return { id: f.label, ...f};
  });

  return uniqBy(
    [...filtersMetadata, ...referencedFields].map(v => getFilterConfig(v)),
    'id'
  );
}
