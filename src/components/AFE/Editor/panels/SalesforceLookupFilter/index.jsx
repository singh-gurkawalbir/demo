import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import 'jQuery-QueryBuilder';
import 'jQuery-QueryBuilder/dist/css/query-builder.default.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';
import { isEmpty, uniqBy } from 'lodash';
import { Spinner } from '@celigo/fuse-ui';
import config from './config';
import '../Filter/queryBuilder.css';
import {
  convertSalesforceLookupFilterExpression,
  getFilterList,
  generateRulesState,
  generateSalesforceLookupFilterExpression,
  getFilterRuleId,
  convertValueToSuiteScriptSupportedExpression,
} from './util';
import { selectors } from '../../../../../reducers';
import OperandSettingsDialog from './OperandSettingsDialog';
import actions from '../../../../../actions';
import { stringCompare } from '../../../../../utils/sort';
import { message } from '../../../../../utils/messageStore';

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    overflowY: 'auto',
    height: '100%',
  },
}));
const defaultData = [];
const defaultFilters = [];

export function SalesforceLookupFilterPanelData({
  id,
  filters: propFilters,
  editorId,
  onFieldChange,
  ssLinkedConnectionId,
}) {
  const qbuilder = useRef(null);
  const classes = useStyles();
  const [showOperandSettingsFor, setShowOperandSettingsFor] = useState();
  const [rules, setRules] = useState();
  const [filtersMetadata, setFiltersMetadata] = useState();
  const [rulesState, setRulesState] = useState({});
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const data = useSelector(state => selectors.editorData(state, editorId) || defaultData);
  const rule = useSelector(state => selectors.editorRule(state, editorId));
  const unsortedFilters = useSelector(state => selectors.editor(state, editorId).filters || propFilters || defaultFilters);
  const isEditorDirty = useSelector(state => selectors.isEditorDirty(state, editorId));

  const filters = useMemo(() => [...unsortedFilters].sort(stringCompare('label')), [unsortedFilters]);

  const dispatch = useDispatch();
  const patchEditor = useCallback(
    value => {
      // convert value to suiteScript supported format if its a ss resource
      const formattedVal = ssLinkedConnectionId ? convertValueToSuiteScriptSupportedExpression(value) : value;

      if (editorId) {
        dispatch(actions.editor.patchRule(editorId, formattedVal || ''));
      }
      if (onFieldChange) {
        onFieldChange(id, formattedVal, !isEditorDirty);
      }
    },
    [dispatch, editorId, id, isEditorDirty, onFieldChange, ssLinkedConnectionId]
  );
  const jsonPathsFromData = useMemo(
    () =>
      uniqBy(
        filters.map(sf => ({ id: sf.value, ...sf, name: sf.label })),
        'id'
      ),
    [filters]
  );
  const salesforceFilterDataTypes = useMemo(
    () =>
      filters.reduce((acc, cur) => {
        acc[cur.value] = cur.type;

        return acc;
      }, {}),
    [filters]
  );

  useEffect(() => {
    const qbRules = convertSalesforceLookupFilterExpression(rule, data, ssLinkedConnectionId);

    if (
        qbRules?.rules?.length === 1 &&
        !qbRules.rules[0].id
    ) {
      qbRules.rules = [];
    }

    setRules(qbRules);
    setRulesState(generateRulesState(qbRules));
  }, [rule, data, ssLinkedConnectionId]);

  useEffect(() => {
    if (rules && filters.length) {
      setFiltersMetadata(getFilterList(jsonPathsFromData, rules));
    }
  }, [jsonPathsFromData, rules, filters]);

  const isValid = () => {
    try {
      return jQuery(qbuilder.current).queryBuilder('validate');
    // eslint-disable-next-line no-empty
    } catch (e) {
    }

    return false;
  };
  const getRules = useCallback((options = {}) => {
    const qbRules = jQuery(qbuilder.current).queryBuilder('getRules', options);

    if (isEmpty(qbRules) || (qbRules && !qbRules.valid)) {
      return undefined;
    }

    const rule = generateSalesforceLookupFilterExpression(
      qbRules,
      salesforceFilterDataTypes
    );

    return rule;
  }, [salesforceFilterDataTypes]);

  const handleFilterRulesChange = useCallback(() => {
    if (isValid()) {
      const rule = getRules();

      patchEditor(rule);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patchEditor, salesforceFilterDataTypes]);

  // useEffect to call handleFilterRulesChange with the updated value of isEditorDirty
  // when the filter has changed, to make the form dirty
  useEffect(() => {
    isEditorDirty && handleFilterRulesChange();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditorDirty]);

  const showOperandSettings = ({ rule, rhs }) => {
    setShowOperandSettingsFor({ rule, rhs });
  };

  const updateUIForRHSRule = ({ name, rule = {} }) => {
    function updateUIForField(rule) {
      if (
        rule.$el.find('.rule-value-container select[name=field]').length === 0
      ) {
        const selectHtml = [
          '<select name="field" class="io-filter-type form-control">',
        ];

        data.forEach(v => {
          selectHtml.push(`<option value="${v.id}">${v.name || v.id}</option>`);
        });
        selectHtml.push('</select>');
        rule.$el.find('.rule-value-container').prepend(selectHtml.join(''));

        const ruleId = getFilterRuleId(rule);
        const field = rule.$el.find(
          '.rule-value-container  select[name=field]'
        );

        if (rulesState[ruleId].data && rulesState[ruleId].data.rhs) {
          field.val(rulesState[ruleId].data.rhs.field);
          setTimeout(() => {
            rule.$el
              .find('.rule-value-container  select[name=field]')
              .trigger('change');
          });
        }

        field.unbind('change').on('change', () => handleFilterRulesChange());
      }
    }

    const ruleId = getFilterRuleId(rule);

    rule.$el.find('.rule-value-container .io-filter-type').remove();
    const ruleState = rulesState[ruleId].data;

    if (ruleState.rhs.type) {
      const filterType = rulesState[ruleId].data.rhs.type;

      if (filterType === 'value') {
        if (!rule.$el.find(`[name=${name}]`).is(':visible')) {
          rule.$el.find(`[name=${name}]`).show();
          rule.$el.find(`[name=${name}]`).val('');
        }
      } else if (filterType === 'field') {
        rule.$el.find(`[name=${name}]`).hide();
        rule.$el.find(`[name=${name}]`).val('field'); // to bypass validation
        updateUIForField(rule);
      }
    }
  };

  const validateRule = rule => {
    const r = rule.data;

    if (r.lhs.type && !r.lhs[r.lhs.type]) {
      return { isValid: false, error: message.FILTER_PANEL.SELECT_LEFT_OPERAND };
    }

    if (r.rhs.type && !r.rhs[r.rhs.type]) {
      return { isValid: false, error: message.FILTER_PANEL.SELECT_RIGHT_OPERAND};
    }

    return {
      isValid: true,
      error: '',
    };
  };

  const generateFiltersConfig = (jsonPaths = []) => {
    const filters = [];

    jsonPaths.forEach(v => {
      filters.push({
        id: v.id,
        label: v.name,
        type: 'string',
        input(rule, name) {
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
          // IO-21280- temp fix. rulesState is not persisting when new filters are added intermittently.
          setRulesState(rulesState);

          if (!disabled) {
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

                    showOperandSettings({ rule, rhs: true });
                  });
              });
            rule.$el
              .find('.rule-value-container')
              .unbind('mouseout')
              .on('mouseout', () => {
                rule.$el.find('.rule-value-container img.settings-icon').hide();
              });
          }

          if (rulesState[ruleId].data.rhs.type !== 'value') {
            setTimeout(() => {
              updateUIForRHSRule({ rule, name });
            });
          }

          const rhsValue = rulesState[ruleId].data.rhs.value === undefined ? '' : rulesState[ruleId].data.rhs.value;

          return `<input class="form-control" name="${name}" value="${rhsValue}">${
            disabled
              ? ''
              // eslint-disable-next-line no-undef
              : `<img style="display:none;" class="settings-icon" src="${CDN_BASE_URI}images/icons/icon/gear.png">`
          }`;
        },
        valueGetter(rule) {
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
          // eslint-disable-next-line no-param-reassign
          rule.data = r;

          return rhsValue;
        },
        validation: {
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
            // eslint-disable-next-line no-param-reassign
            rule.data = r;

            const vr = validateRule(rule);

            if (!vr.isValid) {
              return vr.error;
            }

            return true;
          },
        },
      });
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

      try {
        qbContainer.queryBuilder({
          ...config,
          filters: filtersConfig,
          rules,
        });
      } catch (e) { // do nothing }
      }
      qbContainer
        .unbind('rulesChanged.queryBuilder')
        .on('rulesChanged.queryBuilder', () => {
          handleFilterRulesChange();
        });
      qbContainer.queryBuilder('setFilters', true, filtersConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersMetadata]);

  const handleCloseOperandSettings = () => {
    setShowOperandSettingsFor();
  };

  const handleSubmitOperandSettings = operandSettings => {
    const ruleData =
        rulesState[getFilterRuleId(showOperandSettingsFor.rule)].data[
          showOperandSettingsFor.rhs ? 'rhs' : 'lhs'
        ];

    rulesState[getFilterRuleId(showOperandSettingsFor.rule)].data[
      showOperandSettingsFor.rhs ? 'rhs' : 'lhs'
    ] = { ...ruleData, ...operandSettings };

    if (showOperandSettingsFor.rhs) {
      updateUIForRHSRule({
        rule: showOperandSettingsFor.rule,
        name: `${showOperandSettingsFor.rule.id}_value_0`,
      });
    }

    handleFilterRulesChange();
    handleCloseOperandSettings();
  };

  return (
    <div className={classes.container}>
      <div className="netsuite-lookup-filters" ref={qbuilder} />
      {showOperandSettingsFor && (
      <OperandSettingsDialog
        ruleData={
              rulesState[getFilterRuleId(showOperandSettingsFor.rule)]?.data[
                showOperandSettingsFor.rhs ? 'rhs' : 'lhs'
              ]
            }
            // disabled={disabled}
        onClose={handleCloseOperandSettings}
        onSubmit={handleSubmitOperandSettings}
          />
      )}
    </div>
  );
}

export default function NetSuiteLookupFilterPanel(props) {
  const { sampleDataStatus } = useSelector(state => selectors.editor(state, props.editorId));

  return sampleDataStatus === 'requested' ? <Spinner center="screen" /> : <SalesforceLookupFilterPanelData {...props} />;
}

