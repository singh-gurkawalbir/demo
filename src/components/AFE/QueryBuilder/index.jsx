/* eslint-disable no-param-reassign */
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import 'jQuery-QueryBuilder';
import 'jQuery-QueryBuilder/dist/css/query-builder.default.css';
import jQuery from 'jquery';
import { isEmpty, isArray } from 'lodash';
import config from './config';
import './queryBuilder.css';
import {
  convertIOFilterExpression,
  getFiltersMetadata,
  generateRulesState,
  generateIOFilterExpression,
} from './util';
import OperandSettingsDialog from './OperandSettingsDialog';
import actions from '../../../actions';

const useStyles = makeStyles(() => ({
  container: {
    padding: 5,
  },
  queryBlock: {
    background: 'whitesmoke',
    padding: '16px',
  },
}));
const defaultData = {};

export default function QueryBuilder({
  editorId,
  readOnly,
  data = defaultData,
  rule,
  isDeltaExport = false,
}) {
  //console.log(`QB data ${JSON.stringify(data)}`);

  const dispatch = useDispatch();
  // const handleDataChange = data => {
  //   dispatch(actions.editor.patch(editorId, { data }));
  // };
  const patchEditor = value => {
    dispatch(actions.editor.patch(editorId, { rule: value || [] }));
  };

  const filters = useMemo(() => {
    console.log(`in setFilters useMemo`);

    return Object.keys(isArray(data) ? data[0] : data).map(key => ({
      id: key,
    }));
  }, [data]);
  const qbuilder = useRef(null);
  const classes = useStyles();
  const [showOperandSettingsFor, setShowOperandSettingsFor] = useState();
  const [rules, setRules] = useState();
  const [filtersMetadata, setFiltersMetadata] = useState();
  const [rulesState, setRulesState] = useState({});

  window.ABC = { rules, rulesState, filtersMetadata };

  function getFilterRuleId(rule) {
    return rule.id.split('_rule_')[1];
  }

  function addMissingFieldButton() {
    const buttonHtml =
      '<div class="btn-group"><button type="button" class="btn btn-xs btn-success" data-add="add-missing-field"><i class="glyphicon"></i>Add Missing Field</button></div>';

    jQuery(buttonHtml).prependTo(
      jQuery(jQuery('.rules-group-header:first .group-actions')[0])
    );
    jQuery(jQuery('[data-add=add-missing-field]')[0]).on('click', () => {});
  }

  function showOperandSettings({ rule, rhs }) {
    setShowOperandSettingsFor({ rule, rhs });
  }

  function updateUIForLHSRule({ rule = {} }) {
    function updateUIForValue(rule) {
      if (
        rule.$el.find('.rule-filter-container input[name=value]').length === 0
      ) {
        rule.$el
          .find('[name$=_filter]')
          .after('<input name="value" class="io-filter-type form-control">');

        const ruleId = getFilterRuleId(rule);

        if (rulesState[ruleId].data && rulesState[ruleId].data.lhs) {
          rule.$el
            .find('.rule-filter-container input[name=value]')
            .val(rulesState[ruleId].data.lhs.value)
            .trigger('change');
        }
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

        if (rulesState[ruleId].data && rulesState[ruleId].data.lhs) {
          rule.$el
            .find('.rule-filter-container textarea[name=expression]')
            .val(JSON.stringify(rulesState[ruleId].data.lhs.expression))
            .trigger('change');
        }
      }
    }

    if (!readOnly) {
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
    }

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
  }

  function updateUIForRHSRule({ name, rule = {} }) {
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

        if (rulesState[ruleId].data && rulesState[ruleId].data.rhs) {
          rule.$el
            .find('.rule-value-container  select[name=field]')
            .val(rulesState[ruleId].data.rhs.field);
          setTimeout(() => {
            rule.$el
              .find('.rule-value-container  select[name=field]')
              .trigger('change');
          });
        }
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

        if (rulesState[ruleId].data && rulesState[ruleId].data.rhs) {
          rule.$el
            .find('.rule-value-container  textarea[name=expression]')
            .val(JSON.stringify(rulesState[ruleId].data.rhs.expression))
            .trigger('change');
        }
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
  }

  function validateRule(rule) {
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
  }

  function generateFiltersConfig(jsonPaths = []) {
    const filters = [];

    jsonPaths.forEach(v => {
      filters.push({
        id: v.id,
        label: v.name, // || self.data.metadata[v.id] || v.id,
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

          updateUIForLHSRule({ rule, name });

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

          return `<input class="form-control" name="${name}" value="${rulesState[
            ruleId
          ].data.rhs.value || ''}">${
            readOnly
              ? ''
              : '<img style="display:none;" class="settings-icon" src="https://d142hkd03ds8ug.cloudfront.net/images/icons/icon/gear.png">'
          }`;
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
              (lhsValue === '_CONTEXT.lastExportDateTime' ||
                lhsValue === '_CONTEXT.currentExportDateTime')
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
              (rhsValue === '_CONTEXT.lastExportDateTime' ||
                rhsValue === '_CONTEXT.currentExportDateTime')
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
                (lhsValue === '_CONTEXT.lastExportDateTime' ||
                  lhsValue === '_CONTEXT.currentExportDateTime')
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
                (rhsValue === '_CONTEXT.lastExportDateTime' ||
                  rhsValue === '_CONTEXT.currentExportDateTime')
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

            return lhsValue && rhsValue ? true : 'Error';
          },
        },
      });
    });

    return filters;
  }

  function validate() {
    return jQuery(qbuilder.current).queryBuilder('validate');
  }

  function getRules(options = {}) {
    const result = jQuery(qbuilder.current).queryBuilder('getRules', options);

    if (isEmpty(result) || (result && !result.valid)) {
      return undefined;
    }

    return generateIOFilterExpression(result);
  }

  useEffect(() => {
    console.log(`in setRules useEffect`);
    dispatch(
      actions.editor.init(editorId, 'filter', {
        data,
        autoEvaluate: true,
        rule,
      })
    );
    const { rules } = convertIOFilterExpression(rule);

    setRules(rules);
    setRulesState(generateRulesState(rules));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (rules) {
      console.log(`filters or rules changed`);
      setFiltersMetadata(getFiltersMetadata(filters, rules));
    }
  }, [filters, rules]);

  useEffect(() => {
    console.log(`filtersMetadata changed ${JSON.stringify(filtersMetadata)}`);

    if (filtersMetadata) {
      if (!qbuilder.current) {
        console.log(`!qb.current`);

        const filtersConfig = generateFiltersConfig(filtersMetadata);
        const x = jQuery(qbuilder.current);

        x.on('afterUpdateRuleOperator.queryBuilder', (e, rule) => {
          if (
            rule.operator &&
            (rule.operator.type === 'is_empty' ||
              rule.operator.type === 'is_not_empty')
          ) {
            rule.filter.valueGetter(rule);
          }
        });

        x.queryBuilder({
          ...config,
          filters: filtersConfig,
          rules,
        });
        addMissingFieldButton();
        x.on('rulesChanged.queryBuilder', () => {
          const rule = getRules();

          console.log(`expr ${JSON.stringify(rule)}`);
          patchEditor(rule);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersMetadata]);

  useEffect(() => {
    console.log(`filtersMetadata changed2 ${JSON.stringify(filtersMetadata)}`);

    if (filtersMetadata) {
      if (qbuilder.current) {
        console.log(`qb.current`);

        const filtersConfig = generateFiltersConfig(filtersMetadata);

        jQuery(qbuilder.current).queryBuilder('setFilters',true, filtersConfig);
      }
    }
  })

  function handleCloseOperandSettings() {
    setShowOperandSettingsFor();
  }

  function handleSubmitOperandSettings(operandSettings) {
    const ruleData =
      rulesState[getRgetFilterRuleIduleId(showOperandSettingsFor.rule)].data[
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

    const rule = getRules();

    console.log(`expr 1 ${JSON.stringify(rule)}`);
    patchEditor(rule);
    handleCloseOperandSettings();
  }

  return (
    <div>
      <div className={classes.container}>
        <div ref={qbuilder} />
        {showOperandSettingsFor && (
          <OperandSettingsDialog
            ruleData={
              rulesState[getFilterRuleId(showOperandSettingsFor.rule)].data[
                showOperandSettingsFor.rhs ? 'rhs' : 'lhs'
              ]
            }
            onClose={handleCloseOperandSettings}
            onSubmit={handleSubmitOperandSettings}
          />
        )}
      </div>
    </div>
  );
}
