/* eslint-disable no-param-reassign */
import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import 'jQuery-QueryBuilder';
import 'jQuery-QueryBuilder/dist/css/query-builder.default.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';
import { isEmpty, uniqBy } from 'lodash';
import config from './config';
import '../Filter/queryBuilder.css';
import {
  convertNetSuiteQualifierExpressionToQueryBuilderRules,
  getFilterList,
  generateRulesState,
  generateNetSuiteQualifierExpression,
  getFilterRuleId,
} from './util';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    overflowY: 'auto',
    height: '100%',
  },
}));
const defaultFilters = [];

export default function NetSuiteQualificationCriteriaPanel({ editorId }) {
  const qbuilder = useRef(null);
  const classes = useStyles();
  const [rules, setRules] = useState();
  const [filtersMetadata, setFiltersMetadata] = useState();
  const [rulesState, setRulesState] = useState({});
  const dispatch = useDispatch();
  const rule = useSelector(state => selectors.editorRule(state, editorId));
  const { filters, formKey } = useSelector(state => {
    const editorData = selectors.editor(state, editorId);

    return {
      filters: editorData.filters || defaultFilters,
      formKey: editorData.formKey,
    };
  });

  const useSS2Framework = useSelector(state => selectors.fieldState(state, formKey, 'netsuite.distributed.useSS2Framework'))?.value;

  const patchEditor = useCallback(
    value => {
      dispatch(actions.editor.patchRule(editorId, value || null));
    },
    [dispatch, editorId]
  );
  const jsonPathsFromData = useMemo(
    () =>
      uniqBy(
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
          } else if (filter.type === 'multiselect') {
            if (filter.value.includes('.internalid')) {
              filterData.id = `vals:${filter.value.replace('.internalid', '')}`;
            } else {
              filterData.id = `texts:${filter.value}`;
            }
          } else if (filter.type === 'checkbox') {
            filterData.options = [
              { id: useSS2Framework === 'true' ? true : 'T', text: 'Yes' },
              { id: useSS2Framework === 'true' ? false : 'F', text: 'No' },
            ];
          }

          return filterData;
        }),
        'id'
      ),
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

  const isValid = () => {
    try {
      return jQuery(qbuilder.current).queryBuilder('validate');
    // eslint-disable-next-line no-empty
    } catch (e) {
    }

    return false;
  };
  const getRules = (options = {}) => {
    const qbRules = jQuery(qbuilder.current).queryBuilder('getRules', options);

    if (
      isEmpty(qbRules) ||
      (qbRules && !qbRules.valid) ||
      (qbRules.rules && isEmpty(qbRules.rules))
    ) {
      return undefined;
    }

    return generateNetSuiteQualifierExpression(qbRules);
  };

  const handleFilterRulesChange = useCallback(() => {
    if (isValid()) {
      const rule = getRules();

      patchEditor(rule);
    }
  }, [patchEditor]);
  const validateRule = rule => {
    const r = rule.data;

    if (!r.lhs.field) {
      return { isValid: false, error: 'Please select left operand.' };
    }

    if (!r.rhs.value) {
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
            rulesState[ruleId].data.rhs.type = 'value';
          }
          const rhsValue = rulesState[ruleId].data.rhs.value === undefined ? '' : rulesState[ruleId].data.rhs.value;

          return `<input class="form-control" name="${name}" value="${rhsValue}">`;
        };

        filter.valueGetter = rule => {
          const ruleId = getFilterRuleId(rule);
          const r = (rulesState[ruleId] || {}).data || {};
          const lhsValue = rule.$el
            .find(`.rule-filter-container [name=${rule.id}_filter]`)
            .val();
          const rhsValue = rule.$el
            .find(`.rule-value-container [name=${rule.id}_value_0]`)
            .val();

          if (!r.lhs) {
            r.lhs = {};
          }

          if (!r.rhs) {
            r.rhs = {};
          }

          r.lhs.field = lhsValue;
          r.rhs.value = rhsValue;
          rule.data = r;

          return rhsValue;
        };

        filter.validation = {
          callback(value, rule) {
            const ruleId = getFilterRuleId(rule);
            const r = rulesState[ruleId].data;
            const lhsValue = rule.$el
              .find(`.rule-filter-container [name=${rule.id}_filter]`)
              .val();
            const rhsValue = rule.$el
              .find(`.rule-value-container [name=${rule.id}_value_0]`)
              .val();

            r.lhs.field = lhsValue;
            r.rhs.value = rhsValue;
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

      // qbContainer.on('afterUpdateRuleOperator.queryBuilder', (e, rule) => {
      //   if (
      //     rule.operator &&
      //     (rule.operator.type === 'is_empty' ||
      //       rule.operator.type === 'is_not_empty')
      //   ) {
      //     rule.filter.valueGetter(rule);
      //   }
      // });

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
      <div className="netsuite-qualifier" ref={qbuilder} />
    </div>
  );
}
