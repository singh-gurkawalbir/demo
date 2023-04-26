/* eslint-disable no-param-reassign */
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
  convertNetSuiteLookupFilterExpression,
  getFilterList,
  generateRulesState,
  generateNetSuiteLookupFilterExpression,
  getFilterRuleId,
} from './util';
import { selectors } from '../../../../../reducers';
import OperandSettingsDialog from './OperandSettingsDialog';
import actions from '../../../../../actions';
import { useIsLoggable } from '../../../../IsLoggableContextProvider';
import { message } from '../../../../../utils/messageStore';
import customCloneDeep from '../../../../../utils/customCloneDeep';

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
const isLoggableStr = isLoggable => isLoggable ? '' : 'data-private=true';
export function NetSuiteLookupFilterPanelData({ id, editorId, filters: propFilters, onFieldChange }) {
  const qbuilder = useRef(null);
  const classes = useStyles();
  const [showOperandSettingsFor, setShowOperandSettingsFor] = useState();
  const [rules, setRules] = useState();
  const [filtersMetadata, setFiltersMetadata] = useState();
  const [rulesState, setRulesState] = useState({});
  const disabled = useSelector(state => selectors.isEditorDisabled(state, editorId));
  const data = useSelector(state => selectors.editorData(state, editorId) || defaultData);
  const rule = useSelector(state => selectors.editorRule(state, editorId));
  const filters = useSelector(state => selectors.editor(state, editorId).filters || propFilters || defaultFilters);
  const isEditorDirty = useSelector(state => selectors.isEditorDirty(state, editorId));

  const dispatch = useDispatch();
  const patchEditor = useCallback(
    value => {
      if (editorId) {
        dispatch(actions.editor.patchRule(editorId, value || []));
      }
      if (onFieldChange) {
        onFieldChange(id, JSON.stringify(value), !isEditorDirty);
      }
    },
    [dispatch, editorId, id, isEditorDirty, onFieldChange]
  );
  const jsonPathsFromData = useMemo(
    () =>
      uniqBy(
        filters.map(sf => ({ id: sf.value, ...sf, name: sf.label })),
        'id'
      ),
    [filters]
  );

  useEffect(() => {
    const qbRules = convertNetSuiteLookupFilterExpression(customCloneDeep(rule), data);

    if (
        qbRules?.rules?.length === 1 &&
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

  // useEffect to call handleFilterRulesChange with the updated value of isEditorDirty
  // when the filter has changed, to make the form dirty
  useEffect(() => {
    isEditorDirty && handleFilterRulesChange();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditorDirty]);

  const showOperandSettings = ({ rule, rhs }) => {
    setShowOperandSettingsFor({ rule, rhs });
  };

  const updateUIForLHSRule = ({ rule = {} }) => {
    function updateUIForExpression(rule) {
      if (
        rule.$el.find('.rule-filter-container textarea[name=expression]')
          .length === 0
      ) {
        rule.$el
          .find('[name$=_filter]')
          .after(
            '<textarea name="expression" class="io-filter-type form-control"></textarea>'
          );
        const ruleId = getFilterRuleId(rule);
        const expressionField = rule.$el.find(
          '.rule-filter-container textarea[name=expression]'
        );

        if (rulesState[ruleId].data && rulesState[ruleId].data.lhs) {
          const expressionValue = rulesState[ruleId].data.lhs.expression;

          expressionField
            .val(typeof expressionValue !== 'string' ? JSON.stringify(expressionValue) : expressionValue)
            .trigger('change');
        }

        expressionField
          .unbind('change')
          .on('change', () => handleFilterRulesChange());
      }
    }

    rule.$el.find('.rule-filter-container .io-filter-type').remove();

    if (rule.filter) {
      const ruleId = getFilterRuleId(rule);
      let filterType = rulesState[ruleId].data.lhs.type;

      if (
        filterType === 'field' &&
          ['formuladate', 'formulanumeric', 'formulatext'].indexOf(
            rule.filter.id
          ) > -1
      ) {
        filterType = 'expression';
      }

      if (filterType === 'field') {
        rule.$el.find('[name$=_filter]').show();
      } else if (filterType === 'expression') {
        updateUIForExpression(rule);
      }
    }
  };
  const isLoggable = useIsLoggable();

  const updateUIForRHSRule = ({ name, rule = {} }) => {
    function updateUIForField(rule) {
      if (
        rule.$el.find('.rule-value-container select[name=field]').length === 0
      ) {
        const selectHtml = [
          `<select name="field" ${isLoggableStr(isLoggable)} class="io-filter-type form-control">`,
        ];

        // check if isLoggable works
        data.forEach(v => {
          selectHtml.push(`<option ${isLoggableStr(isLoggable)} value="${v.id}">${v.name || v.id}</option>`);
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

    function updateUIForExpression(rule) {
      if (
        rule.$el.find('.rule-value-container textarea[name=expression]')
          .length === 0
      ) {
        rule.$el
          .find('.rule-value-container')
          .prepend(
            `<textarea name="expression" ${isLoggableStr(isLoggable)} class="io-filter-type form-control"></textarea>`
          );

        const ruleId = getFilterRuleId(rule);
        const expressionField = rule.$el.find(
          '.rule-value-container  textarea[name=expression]'
        );

        if (rulesState[ruleId].data && rulesState[ruleId].data.rhs) {
          expressionField
            .val(rulesState[ruleId].data.rhs.expression)
            .trigger('change');
        }

        expressionField
          .unbind('change')
          .on('change', () => handleFilterRulesChange());
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
      } else if (filterType === 'expression') {
        rule.$el.find(`[name=${name}]`).hide();
        rule.$el.find(`[name=${name}]`).val('expression'); // to bypass validation
        updateUIForExpression(rule);
      }
    }
  };

  const validateRule = rule => {
    const r = rule.data;

    if (r.lhs.type && !r.lhs[r.lhs.type]) {
      return { isValid: false, error: message.FILTER_PANEL.SELECT_LEFT_OPERAND};
    }

    if (r.rhs.type && !r.rhs[r.rhs.type]) {
      return { isValid: false, error: message.FILTER_PANEL.SELECT_RIGHT_OPERAND };
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

          setTimeout(() => {
            updateUIForLHSRule({ rule, name });
          });

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

          return `<input class="form-control" ${isLoggableStr(isLoggable)} name="${name}" value="${rhsValue}">${
            disabled
              ? ''
              // eslint-disable-next-line no-undef
              : `<img style="display:none;" class="settings-icon" src="${CDN_BASE_URI}images/icons/icon/gear.png">`
          }`;
        },
        valueGetter(rule) {
          const ruleId = getFilterRuleId(rule);
          const r = rulesState[ruleId].data;
          let lhsValue = rule.$el
            .find(`.rule-filter-container [name=${rule.id}_filter]`)
            .val();

          if (
            ['formuladate', 'formulanumeric', 'formulatext'].indexOf(lhsValue) >
              -1
          ) {
            r.lhs.type = 'expression';
            lhsValue = rule.$el
              .find('.rule-filter-container [name=expression]')
              .val();
          } else if (r.lhs.type !== 'value') {
            r.lhs.type = 'field';
            lhsValue = rule.$el
              .find('.rule-filter-container [name=field]')
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

          if (!rhsValue) {
            rhsValue = r.rhs[r.rhs.type];
          }

          r.lhs[r.lhs.type || 'field'] = lhsValue || r.lhs[r.lhs.type || 'field'];
          r.rhs[r.rhs.type || 'value'] = rhsValue;
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

            r.lhs[r.lhs.type || 'field'] = lhsValue || r.lhs[r.lhs.type || 'field'];
            r.rhs[r.rhs.type || 'value'] = rhsValue;
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

      // eslint-disable-next-line no-restricted-syntax
      for (const ruleId in rulesState) {
        if (Object.hasOwnProperty.call(rulesState, ruleId) && rulesState[ruleId]?.rule) {
          if (rulesState[ruleId].data?.lhs?.type === 'expression') {
            updateUIForLHSRule({rule: rulesState[ruleId].rule});
          }
        }
      }
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
    } else {
      updateUIForLHSRule({
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

  return sampleDataStatus === 'requested' ? <Spinner center="screen" /> : <NetSuiteLookupFilterPanelData {...props} />;
}
