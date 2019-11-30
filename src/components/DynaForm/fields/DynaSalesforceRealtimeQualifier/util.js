/* eslint-disable no-useless-escape */
/* eslint-disable no-param-reassign */
import { filter, isEmpty } from 'lodash';
import jQuery from 'jquery';

export function getFilterRuleId(rule) {
  return rule.id.split('_rule_')[1];
}

const updateRulesForSOQL = (dataIn = { rules: [] }) => {
  dataIn.rules.forEach(r => {
    if (r.rules && r.rules.length > 0) {
      updateRulesForSOQL(r);
    } else if (
      ['equal', 'not_equal'].indexOf(r.operator) > -1 &&
      r.value === null
    ) {
      r.operator = r.operator === 'equal' ? 'is_null' : 'is_not_null';
    }

    // if (r.id && r.id.indexOf('.') > -1) {
    //   self.data.referenceFieldsUsed.push(r.id);
    // }
  });
};

export function convertSalesforceQualificationCriteria(sql, queryBuilder) {
  let rules;

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
    rules = jQuery(queryBuilder).queryBuilder('getRulesFromSQL', sql);
    updateRulesForSOQL(rules);
  }

  return rules;
}

const getFilterTypeAndOperators = field => {
  let type;

  if (field && field.type) {
    switch (field.type) {
      case 'int':
        type = 'integer';
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

export function getFilterConfig(field, options = {}) {
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
        if (!rr.id) {
          if (jsonPaths.length === 0) {
            jsonPaths.push({ id: 'sampleField', name: 'sampleField' });
          }

          rr.id = jsonPaths[0].id;
        }

        if (!filter(jsonPaths, { id: rr.id }).length) {
          jsonPaths.push({ id: rr.id });
        }

        if (rr.rhs && rr.rhs.type === 'field' && rr.rhs.field) {
          if (!filter(jsonPaths, { id: rr.rhs.field }).length) {
            jsonPaths.push({ id: rr.rhs.field });
          }
        }
      }
    });
  }

  if (rules.length > 0) {
    iterate(rules);
  }

  if (jsonPaths.length === 0) {
    jsonPaths.push({ id: 'sampleField', name: 'sampleField' });
  }

  return jsonPaths;
}

export function generateRulesState(rules) {
  const rulesState = {};
  let ruleIndex = -1;

  function iterate(r) {
    r.rules.forEach(rr => {
      if (rr.condition) {
        iterate(rr);
      } else {
        ruleIndex += 1;
        rulesState[ruleIndex] = {
          data: rr.data,
        };
      }
    });
  }

  iterate(rules);

  return rulesState;
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
