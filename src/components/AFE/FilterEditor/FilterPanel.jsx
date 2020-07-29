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
// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';
import { isEmpty, isArray, isString } from 'lodash';
import config from './config';
import './queryBuilder.css';
import {
  convertIOFilterExpression,
  getFilterList,
  generateRulesState,
  generateIOFilterExpression,
  getFilterRuleId,
} from './util';
import OperandSettingsDialog from './OperandSettingsDialog';
import actions from '../../../actions';
import getJSONPaths from '../../../utils/jsonPaths';

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    height: '100%',
    overflowY: 'auto',
  },
}));
const defaultData = {};

export default function FilterPanel({
  editorId,
  data = defaultData,
  rule,
  disabled,
}) {
  const qbuilder = useRef(null);
  const classes = useStyles();
  const [showOperandSettingsFor, setShowOperandSettingsFor] = useState();
  const [rules, setRules] = useState();
  const [filtersMetadata, setFiltersMetadata] = useState();
  const [rulesState, setRulesState] = useState({});
  const dispatch = useDispatch();
  const patchEditor = useCallback(
    value => {
      dispatch(actions.editor.patch(editorId, { rule: value || [] }));
    },
    [dispatch, editorId]
  );
  const patchEditorValidation = useCallback(isInvalid => {
    dispatch(actions.editor.patch(editorId, { isInvalid }));
  }, [dispatch, editorId]);

  const jsonPathsFromData = useMemo(() => {
    let d;

    if (isString(data)) {
      try {
        d = JSON.parse(data);
      } catch (ex) {
        d = {};
      }
    } else {
      d = data;
    }

    if (!d.record) {
      d.record = {};
    }

    const jsonPaths = getJSONPaths(
      isArray(d.record) ? d.record[0] : d.record,
      null,
      {
        wrapSpecialChars: true,
      }
    )
      .filter(p => p.id && !p.id.includes('[*].'))
      .map(p => ({ ...p, id: `record.${p.id}` }));

    ['pageIndex', 'lastExportDateTime', 'currentExportDateTime'].forEach(p => {
      if (Object.hasOwnProperty.call(d, p)) {
        jsonPaths.push({ id: p });
      }
    });

    getJSONPaths(d.settings, null, {
      wrapSpecialChars: true,
    })
      .filter(p => p.id && !p.id.includes('[*].'))
      .forEach(p => {
        jsonPaths.push({ id: `settings.${p.id}` });
      });

    return jsonPaths;
  }, [data]);

  useEffect(() => {
    const rules = convertIOFilterExpression(rule);

    setRules(rules);
    setRulesState(generateRulesState(rules));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rules) {
      setFiltersMetadata(getFilterList(jsonPathsFromData, rules));
    }
  }, [jsonPathsFromData, rules]);

  const isValid = () => jQuery(qbuilder.current).queryBuilder('validate');
  const getRules = (options = {}) => {
    const result = jQuery(qbuilder.current).queryBuilder('getRules', options);

    if (isEmpty(result) || (result && !result.valid)) {
      return undefined;
    }

    return generateIOFilterExpression(result);
  };

  const handleFilterRulesChange = () => {
    patchEditorValidation(!isValid());
    if (isValid()) {
      const rule = getRules();

      patchEditor(rule);
    }
  };

  const showOperandSettings = ({ rule, rhs }) => {
    setShowOperandSettingsFor({ rule, rhs });
  };

  const updateUIForLHSRule = ({ rule = {} }) => {
    function updateUIForValue(rule) {
      if (
        rule.$el.find('.rule-filter-container input[name=value]').length === 0
      ) {
        rule.$el
          .find('[name$=_filter]')
          .after('<input name="value" class="io-filter-type form-control">');

        const ruleId = getFilterRuleId(rule);
        const valueField = rule.$el.find(
          '.rule-filter-container input[name=value]'
        );

        if (rulesState[ruleId].data && rulesState[ruleId].data.lhs) {
          valueField.val(rulesState[ruleId].data.lhs.value).trigger('change');
        }

        valueField
          .unbind('change')
          .on('change', () => handleFilterRulesChange());
      }
    }

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
          expressionField
            .val(JSON.stringify(rulesState[ruleId].data.lhs.expression))
            .trigger('change');
        }

        expressionField
          .unbind('change')
          .on('change', () => handleFilterRulesChange());
      }
    }

    if (
      rule.$el.find('.rule-filter-container img.settings-icon').length === 0
    ) {
      rule.$el
        .find('[name$=_filter]')
        .after(
          '<img style="display:none;" class="settings-icon" src="https://d142hkd03ds8ug.cloudfront.net/images/icons/icon/gear.png">'
        );
      rule.$el
        .find('.rule-filter-container img.settings-icon')
        .unbind('click')
        .on('click', () => {
          showOperandSettings({ rule });
        });
    }

    rule.$el
      .find('.rule-filter-container')
      .unbind('mouseover')
      .on('mouseover', () => {
        rule.$el.find('.rule-filter-container img.settings-icon').show();
      });
    rule.$el
      .find('.rule-filter-container')
      .unbind('mouseout')
      .on('mouseout', () => {
        rule.$el.find('.rule-filter-container img.settings-icon').hide();
      });

    rule.$el.find('.rule-filter-container .io-filter-type').remove();

    if (rule.filter) {
      const ruleId = getFilterRuleId(rule);
      const filterType = rulesState[ruleId].data.lhs.type;

      if (filterType === 'value') {
        rule.$el.find('[name$=_filter]').hide();
        updateUIForValue(rule);
      } else if (filterType === 'field') {
        rule.$el.find('[name$=_filter]').show();
      } else if (filterType === 'expression') {
        rule.$el.find('[name$=_filter]').hide();
        updateUIForExpression(rule);
      }
    }
  };

  const updateUIForRHSRule = ({ name, rule = {} }) => {
    function updateUIForField(rule) {
      if (
        rule.$el.find('.rule-value-container select[name=field]').length === 0
      ) {
        const selectHtml = [
          '<select name="field" class="io-filter-type form-control">',
        ];

        filtersMetadata.forEach(v => {
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

    function updateUIForExpression(rule) {
      if (
        rule.$el.find('.rule-value-container textarea[name=expression]')
          .length === 0
      ) {
        rule.$el
          .find('.rule-value-container')
          .prepend(
            '<textarea name="expression" class="io-filter-type form-control"></textarea>'
          );

        const ruleId = getFilterRuleId(rule);
        const expressionField = rule.$el.find(
          '.rule-value-container  textarea[name=expression]'
        );

        if (rulesState[ruleId].data && rulesState[ruleId].data.rhs) {
          expressionField
            .val(JSON.stringify(rulesState[ruleId].data.rhs.expression))
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
    const toReturn = {
      isValid: true,
      error: '',
    };
    let op;

    if (r.lhs.type === 'expression') {
      try {
        JSON.parse(r.lhs.expression);

        if (JSON.parse(r.lhs.expression).length < 2) {
          toReturn.isValid = false;
          toReturn.error = 'Please enter a valid expression.';
        }
      } catch (ex) {
        toReturn.isValid = false;
        toReturn.error = 'Expression should be a valid JSON.';
      }

      if (toReturn.isValid) {
        [op] = JSON.parse(r.lhs.expression);

        if (
          [
            'add',
            'subtract',
            'divide',
            'multiply',
            'modulo',
            'ceiling',
            'floor',
            'number',
          ].includes(op)
        ) {
          r.lhs.dataType = 'number';
        } else if (op === 'epochtime') {
          r.lhs.dataType = 'epochtime';
        } else if (op === 'boolean') {
          r.lhs.dataType = 'boolean';
        } else {
          r.lhs.dataType = 'string';
        }
      }
    }

    if (!toReturn.isValid) {
      return toReturn;
    }

    if (r.rhs.type === 'expression') {
      try {
        JSON.parse(r.rhs.expression);

        if (JSON.parse(r.rhs.expression).length < 2) {
          toReturn.isValid = false;
          toReturn.error = 'Please enter a valid expression.';
        }
      } catch (ex) {
        toReturn.isValid = false;
        toReturn.error = 'Expression should be a valid JSON.';
      }

      if (toReturn.isValid) {
        [op] = JSON.parse(r.rhs.expression);

        if (
          [
            'add',
            'subtract',
            'divide',
            'multiply',
            'modulo',
            'ceiling',
            'floor',
            'number',
          ].includes(op)
        ) {
          r.rhs.dataType = 'number';
        } else if (op === 'epochtime') {
          r.rhs.dataType = 'epochtime';
        } else if (op === 'boolean') {
          r.rhs.dataType = 'boolean';
        } else {
          r.rhs.dataType = 'string';
        }
      }
    }

    if (!toReturn.isValid) {
      return toReturn;
    }

    /*
    if (r.lhs.dataType === 'epochtime' || r.rhs.dataType === 'epochtime') {
      r.lhs.dataType = r.rhs.dataType = 'epochtime'
    }
    */
    if (r.lhs.dataType && r.rhs.dataType && r.lhs.dataType !== r.rhs.dataType) {
      toReturn.isValid = false;
      toReturn.error = 'Data types of both the operands should match.';
    }

    if (!toReturn.isValid) {
      return toReturn;
    }

    if (r.lhs.type && !r.lhs[r.lhs.type]) {
      toReturn.isValid = false;
      toReturn.error = 'Please select left operand.';
    }

    if (!toReturn.isValid) {
      return toReturn;
    }

    if (r.rhs.type && !r.rhs[r.rhs.type]) {
      toReturn.isValid = false;
      toReturn.error = 'Please select right operand.';
    }

    if (!toReturn.isValid) {
      return toReturn;
    }

    return toReturn;
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
            rulesState[ruleId].data.rhs.type = 'value';
          }

          setTimeout(() => {
            updateUIForLHSRule({ rule, name });
          });

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

          if (rulesState[ruleId].data.rhs.type !== 'value') {
            setTimeout(() => {
              updateUIForRHSRule({ rule, name });
            });
          }
          const rhsValue = rulesState[ruleId].data.rhs.value === undefined ? '' : rulesState[ruleId].data.rhs.value;

          return `<input class="form-control" name="${name}" value="${rhsValue}"><img style="display:none;" class="settings-icon" src="https://d142hkd03ds8ug.cloudfront.net/images/icons/icon/gear.png">`;
        },
        valueGetter(rule) {
          const ruleId = getFilterRuleId(rule);
          const r = rulesState[ruleId].data;
          let lhsValue = rule.$el
            .find(`.rule-filter-container [name=${rule.id}_filter]`)
            .val();

          if (r.lhs.type !== 'field') {
            lhsValue = rule.$el
              .find(`.rule-filter-container [name=${r.lhs.type}]`)
              .val();

            if (!lhsValue) {
              lhsValue = r.lhs[r.lhs.type];
            }

            if (r.lhs.type === 'expression') {
              try {
                lhsValue = JSON.parse(lhsValue);
              } catch (ex) {
                // do nothing
              }
            }
          }

          if (r.lhs.type === 'field') {
            if (
              lhsValue &&
              (lhsValue === 'lastExportDateTime' ||
                lhsValue === 'currentExportDateTime')
            ) {
              r.lhs.dataType = 'epochtime';
            }
          }

          if (!r.lhs.dataType) {
            r.lhs.dataType = 'string';
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

          if (r.rhs.type === 'field') {
            if (
              rhsValue &&
              (rhsValue === 'lastExportDateTime' ||
                rhsValue === 'currentExportDateTime')
            ) {
              r.rhs.dataType = 'epochtime';
            }
          }

          if (!r.rhs.dataType) {
            r.rhs.dataType = 'string';
          }

          r.lhs[r.lhs.type || 'field'] = lhsValue;
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

            if (r.lhs.type === 'field') {
              if (
                lhsValue &&
                (lhsValue === 'lastExportDateTime' ||
                  lhsValue === 'currentExportDateTime')
              ) {
                r.lhs.dataType = 'epochtime';
              }
            }

            if (!r.lhs.dataType) {
              r.lhs.dataType = 'string';
            }

            let rhsValue = rule.$el
              .find(`.rule-value-container [name=${rule.id}_value_0]`)
              .val();

            if (r.rhs.type !== 'value') {
              rhsValue = rule.$el
                .find(`.rule-value-container [name=${r.rhs.type}]`)
                .val();
            }

            if (r.rhs.type === 'field') {
              if (
                rhsValue &&
                (rhsValue === 'lastExportDateTime' ||
                  rhsValue === 'currentExportDateTime')
              ) {
                r.rhs.dataType = 'epochtime';
              }
            }

            if (!r.rhs.dataType) {
              r.rhs.dataType = 'string';
            }

            r.lhs[r.lhs.type || 'field'] = lhsValue;
            r.rhs[r.rhs.type || 'value'] = rhsValue;
            rule.data = r;
            const vr = validateRule(rule);

            if (!vr.isValid) {
              return vr.error;
            }

            if (vr.isValid) {
              return true;
            }

            if (lhsValue && rhsValue) {
              return true;
            }

            return 'Error';
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

      if (disabled) {
        setTimeout(() => {
          jQuery(`#${qbuilder.current.id} button[data-not!=group]`).hide();
          jQuery(`#${qbuilder.current.id} button[data-not=group]`).prop(
            'disabled',
            true
          );
          jQuery(`#${qbuilder.current.id} select`).prop('disabled', true);
          jQuery(`#${qbuilder.current.id} input`).prop('disabled', true);
        });
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
      <div ref={qbuilder} />
      {showOperandSettingsFor && (
        <OperandSettingsDialog
          ruleData={
            rulesState[getFilterRuleId(showOperandSettingsFor.rule)].data[
              showOperandSettingsFor.rhs ? 'rhs' : 'lhs'
            ]
          }
          disabled={disabled}
          onClose={handleCloseOperandSettings}
          onSubmit={handleSubmitOperandSettings}
        />
      )}
    </div>
  );
}
