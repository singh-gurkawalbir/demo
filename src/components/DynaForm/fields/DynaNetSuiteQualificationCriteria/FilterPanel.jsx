/* eslint-disable no-param-reassign */
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import 'jQuery-QueryBuilder';
import 'jQuery-QueryBuilder/dist/css/query-builder.default.css';
import jQuery from 'jquery';
import { isEmpty } from 'lodash';
import config from './config';
import './queryBuilder.css';
import {
  convertNetSuiteQualifierExpressionToQueryBuilderRules,
  getFilterList,
  generateRulesState,
  generateNetSuiteLookupFilterExpression,
  getFilterRuleId,
} from './util';
import actions from '../../../../actions';

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    height: '100%',
    overflowY: 'auto',
  },
}));
const defaultFilters = [];

export default function FilterPanel({
  id,
  onFieldChange,
  editorId,
  rule,
  filters = defaultFilters,
  readOnly,
}) {
  const qbuilder = useRef(null);
  const classes = useStyles();
  const [rules, setRules] = useState();
  const [filtersMetadata, setFiltersMetadata] = useState();
  const [rulesState, setRulesState] = useState({});
  const dispatch = useDispatch();
  const patchEditor = useCallback(
    value => {
      if (editorId) {
        dispatch(actions.editor.patch(editorId, { rule: value || [] }));
      } else if (onFieldChange) {
        onFieldChange(id, JSON.stringify(value));
      }
    },
    [dispatch, editorId, id, onFieldChange]
  );
  const jsonPathsFromData = useMemo(
    () =>
      filters.map(filter => {
        const filterData = {
          id: filter.value,
          ...filter,
          name: filter.label,
        };

        if (filter.type === 'select') {
          if (filter.value.includes('.internalid')) {
            filterData.id = `val:${filter.value.replace('.internalid', '')}`;
          } else {
            filterData.id = `text:${filter.value}`;
          }
        } else if (filter.type === 'checkbox') {
          filterData.options = [
            { id: 'T', text: 'Yes' },
            { id: 'F', text: 'No' },
          ];
        }

        return filterData;
      }),
    [filters]
  );

  useEffect(() => {
    const qbRules = convertNetSuiteQualifierExpressionToQueryBuilderRules(
      rule,
      filters
    );

    if (
      qbRules &&
      qbRules.rules &&
      qbRules.rules.length === 1 &&
      !qbRules.rules[0].id
    ) {
      qbRules.rules = [];
    }

    setRules(qbRules);
    setRulesState(generateRulesState(qbRules));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rules) {
      setFiltersMetadata(getFilterList(jsonPathsFromData, rules));
    }
  }, [jsonPathsFromData, rules]);

  const isValid = () => jQuery(qbuilder.current).queryBuilder('validate');
  const getRules = (options = {}) => {
    const qbRules = jQuery(qbuilder.current).queryBuilder('getRules', options);

    if (isEmpty(qbRules) || (qbRules && !qbRules.valid)) {
      return undefined;
    }

    return generateNetSuiteLookupFilterExpression(qbRules);
  };

  const handleFilterRulesChange = useCallback(() => {
    if (isValid()) {
      const rule = getRules();

      patchEditor(rule);
    }
  }, [patchEditor]);
  const validateRule = rule => {
    const r = rule.data;

    if (r.lhs.type && !r.lhs[r.lhs.type]) {
      return { isValid: false, error: 'Please select left operand.' };
    }

    if (r.rhs.type && !r.rhs[r.rhs.type]) {
      return { isValid: false, error: 'Please select right operand.' };
    }

    return {
      isValid: true,
      error: '',
    };
  };

  const generateFiltersConfig = (jsonPaths = []) => {
    const filters = [];

    jsonPaths.forEach(v => {
      const filter = {
        id: v.id,
        label: v.name,
        type: 'string',
      };

      if (v.options && v.options.length > 0) {
        filter.input = 'select';
        filter.values = {};
        v.options.forEach(opt => {
          if (filter.id.includes('text:')) {
            filter.values[opt.text] = opt.text;
          } else {
            filter.values[opt.id] = opt.text;
          }
        });
      } else {
        filter.input = (rule, name) => {
          const ruleId = getFilterRuleId(rule);

          if (!rulesState[ruleId]) {
            rulesState[ruleId] = {};
          }

          rulesState[ruleId].rule = rule;

          if (!rulesState[ruleId].data) {
            rulesState[ruleId].data = {};
          }

          if (!rulesState[ruleId].data.lhs) {
            rulesState[ruleId].data.lhs = {};
          }

          if (!rulesState[ruleId].data.rhs) {
            rulesState[ruleId].data.rhs = {};
          }

          if (!rulesState[ruleId].data.lhs.type) {
            rulesState[ruleId].data.lhs.type = 'field';
          }

          if (!rulesState[ruleId].data.rhs.type) {
            rulesState[ruleId].data.rhs.type = 'field';
          }

          if (!readOnly) {
            rule.$el
              .find('.rule-value-container')
              .unbind('mouseover')
              .on('mouseover', () => {
                rule.$el.find('.rule-value-container img.settings-icon').show();
                rule.$el
                  .find('.rule-value-container img.settings-icon')
                  .unbind('click')
                  .on('click', () => {
                    if (rulesState[ruleId].data.rhs.type === 'field') {
                      const rhsField = rule.$el
                        .find(
                          `.rule-value-container [name=${rulesState[ruleId].data.rhs.type}]`
                        )
                        .val();

                      if (rhsField) {
                        rulesState[ruleId].data.rhs.field = rhsField;
                      }
                    }
                  });
              });
            rule.$el
              .find('.rule-value-container')
              .unbind('mouseout')
              .on('mouseout', () => {
                rule.$el.find('.rule-value-container img.settings-icon').hide();
              });
          }

          return `<input class="form-control" name="${name}" value="${rulesState[
            ruleId
          ].data.rhs.value || ''}">`;
        };

        filter.valueGetter = rule => {
          const ruleId = getFilterRuleId(rule);
          const r = rulesState[ruleId].data;
          const lhsValue = rule.$el
            .find(`.rule-filter-container [name=${rule.id}_filter]`)
            .val();
          let rhsValue = rule.$el
            .find(`.rule-value-container [name=${rule.id}_value_0]`)
            .val();

          if (r.rhs.type !== 'value') {
            rhsValue = rule.$el
              .find(`.rule-value-container [name=${r.rhs.type}]`)
              .val();
          }

          if (!rhsValue) {
            rhsValue = r.rhs[r.rhs.type];
          }

          r.lhs[r.lhs.type || 'field'] = lhsValue;
          r.rhs[r.rhs.type || 'value'] = rhsValue;
          rule.data = r;

          return rhsValue;
        };

        filter.validation = {
          callback(value, rule) {
            const ruleId = getFilterRuleId(rule);
            const r = rulesState[ruleId].data;
            let lhsValue = rule.$el
              .find(`.rule-filter-container [name=${rule.id}_filter]`)
              .val();

            if (r.lhs.type !== 'field') {
              lhsValue = rule.$el
                .find(`.rule-filter-container [name=${r.lhs.type}]`)
                .val();
            }

            let rhsValue = rule.$el
              .find(`.rule-value-container [name=${rule.id}_value_0]`)
              .val();

            if (r.rhs.type !== 'value') {
              rhsValue = rule.$el
                .find(`.rule-value-container [name=${r.rhs.type}]`)
                .val();
            }

            r.lhs[r.lhs.type || 'field'] = lhsValue;
            r.rhs[r.rhs.type || 'value'] = rhsValue;
            rule.data = r;

            const vr = validateRule(rule);

            if (!vr.isValid) {
              return vr.error;
            }

            return true;
          },
        };
      }

      filters.push(filter);
    });

    return filters;
  };

  useEffect(() => {
    if (filtersMetadata) {
      const filtersConfig = generateFiltersConfig(filtersMetadata);
      const qbContainer = jQuery(qbuilder.current);

      qbContainer.on('afterUpdateRuleOperator.queryBuilder', (e, rule) => {
        if (
          rule.operator &&
          (rule.operator.type === 'is_empty' ||
            rule.operator.type === 'is_not_empty')
        ) {
          rule.filter.valueGetter(rule);
        }
      });

      qbContainer.queryBuilder({
        ...config,
        filters: filtersConfig,
        rules,
      });
      qbContainer
        .unbind('rulesChanged.queryBuilder')
        .on('rulesChanged.queryBuilder', () => {
          handleFilterRulesChange();
        });
      qbContainer.queryBuilder('setFilters', true, filtersConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersMetadata]);

  return (
    <div className={classes.container}>
      <div ref={qbuilder} />
    </div>
  );
}
