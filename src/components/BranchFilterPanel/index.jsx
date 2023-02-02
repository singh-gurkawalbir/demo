/* eslint-disable no-param-reassign */
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { isEmpty, cloneDeep } from 'lodash';
import 'jQuery-QueryBuilder';
import 'jQuery-QueryBuilder/dist/css/query-builder.default.css';
// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';
import '../AFE/Editor/panels/Filter/queryBuilder.css';
import { useDispatch, useSelector } from 'react-redux';
import config from '../AFE/Editor/panels/Filter/config';
import '../AFE/Editor/panels/Router/BranchFilter/qbOverrides.css';
import {
  convertIOFilterExpression,
  getFilterList,
  generateRulesState,
  generateIOFilterExpression,
  getFilterRuleId,
} from '../AFE/Editor/panels/Filter/util';
import OperandSettingsDialog from '../AFE/Editor/panels/Filter/OperandSettingsDialog';
import actions from '../../actions';
import { selectors } from '../../reducers';
import getJSONPaths from '../../utils/jsonPaths';
import { safeParse, isNumber } from '../../utils/string';

const defaultData = {};

export default function BranchFilterPanel({ editorId, position, type, rule, handlePatchEditor }) {
  // console.log(editorId, rule, event);
  const qbuilder = useRef(null);
  const disabled = useSelector(state =>
    selectors.isEditorDisabled(state, editorId)
  );
  const data = useSelector(
    state => selectors.editorData(state, editorId) || defaultData
  );

  const skipEmptyRuleCleanup = useSelector(state => {
    if (type === 'branchFilter') {
      const editorRule = selectors.editorRule(state, editorId);

      return !!editorRule?.branches?.[position]?.skipEmptyRuleCleanup;
    }

    return false;
  });

  const [showOperandSettingsFor, setShowOperandSettingsFor] = useState();
  const [rules, setRules] = useState();
  const [filtersMetadata, setFiltersMetadata] = useState();
  const [rulesState, setRulesState] = useState({});
  const dispatch = useDispatch();

  const setSkipEmptyRuleCleanup = useCallback(() => {
    if (type === 'branchFilter') {
    // console.log('setSkipEmptyRuleCleanup: ', position);
      dispatch(
        actions.editor.patchRule(editorId, true, {
          rulePath: `branches[${position}].skipEmptyRuleCleanup`,
        })
      );
    }
  }, [dispatch, type, position, editorId]);

  const patchEditorValidation = useCallback(
    (isInvalid, error) => {
      const featurePatch = {
        isInvalid,
        error,
        disablePreview: isInvalid,
      };

      if (error) {
        featurePatch.result = undefined;
      }
      dispatch(actions.editor.patchFeatures(editorId, featurePatch));
    },
    [dispatch, editorId]
  );
  const jsonData = useMemo(() => safeParse(data) || {}, [data]);
  const context = jsonData.rows ? 'rows[0]' : 'record';

  const jsonPathsFromData = useMemo(() => {
    const jsonPaths = getJSONPaths(
      jsonData.rows ? jsonData.rows[0] : jsonData.record,
      null,
      {
        wrapSpecialChars: true,
        includeArrayLength: true,
      }
    )
      .filter(p => p.id && !p.id.includes('[*].'))
      .map(p => ({ ...p, id: `${context}.${p.id}` }));

    ['pageIndex', 'lastExportDateTime', 'currentExportDateTime'].forEach(p => {
      if (Object.hasOwnProperty.call(jsonData, p)) {
        jsonPaths.push({ id: p });
      }
    });

    getJSONPaths(jsonData.settings, null, {
      wrapSpecialChars: true,
      includeArrayLength: true,
    })
      .filter(p => p.id && !p.id.includes('[*].'))
      .forEach(p => {
        jsonPaths.push({ id: `settings.${p.id}`, type: p.type });
      });

    return jsonPaths;
  }, [context, jsonData]);

  useEffect(() => {
    const rules = convertIOFilterExpression(rule, context);

    setRules(rules);
    setRulesState(generateRulesState(rules));
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
    } catch (e) {}

    return false;
  };
  const getRules = (options = {}) => {
    const result = jQuery(qbuilder.current).queryBuilder('getRules', options);

    if (isEmpty(result) || (result && !result.valid)) {
      return undefined;
    }

    return generateIOFilterExpression(result, context);
  };

  const handleFilterRulesChange = () => {
    patchEditorValidation(!isValid());
    if (isValid()) {
      const rule = getRules();

      handlePatchEditor(rule);
    }
  };
  const showOperandSettings = ({ rule, rhs }) => {
    setShowOperandSettingsFor({ rule, rhs });
  };

  const updateUIForLHSRule = ({ name, rule = {} }) => {
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
          valueField.val(rulesState[ruleId].data.lhs.value).trigger('input');
        }
        valueField.off('focusout').on('focusout', () => {
          if (
            rule.operator &&
            (rule.operator.type === 'is_empty' ||
              rule.operator.type === 'is_not_empty')
          ) {
            rule.filter.valueGetter(rule);
          }
          handleFilterRulesChange();
        });
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
            .trigger('input');
        }
        expressionField
          .off('focusout')
          .on('focusout', () => handleFilterRulesChange());
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
        .off('click')
        .on('click', () => {
          showOperandSettings({ rule });
        });
    }
    rule.$el
      .find('.rule-filter-container')
      .off('mouseover')
      .on('mouseover', () => {
        rule.$el.find('.rule-filter-container img.settings-icon').show();
      });
    rule.$el
      .find('.rule-filter-container')
      .off('mouseout')
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

    const valueField = rule.$el.find(`[name=${name}]`);

    valueField.off('focusout').on('focusout', () => handleFilterRulesChange());
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

        field.off('change').on('change', () => handleFilterRulesChange());
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
            .trigger('input');
        }

        expressionField
          .off('focusout')
          .on('focusout', () => handleFilterRulesChange());
      }
    }

    const ruleId = getFilterRuleId(rule);

    rule.$el.find('.rule-value-container .io-filter-type').remove();
    const ruleState = rulesState[ruleId].data;

    if (ruleState.rhs.type) {
      const filterType = rulesState[ruleId].data.rhs.type;

      if (filterType === 'value') {
        const valueField = rule.$el.find(`[name=${name}]`);

        if (!valueField.is(':visible')) {
          valueField.show();
          valueField.val('');
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
        const parsedExp = JSON.parse(r.lhs.expression);

        if (!parsedExp.length || parsedExp.length < 2) {
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
            'abs',
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
        const parsedExp = JSON.parse(r.rhs.expression);

        if (!parsedExp.length || parsedExp.length < 2) {
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
            'abs',
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

    if (r.rhs.type === 'value' || r.lhs.type === 'value') {
      const {dataType: dataTypeRhs, value: valueRhs, type: typeRhs} = r.rhs;
      const {dataType: dataTypeLhs, value: valueLhs, type: typeLhs} = r.lhs;

      // skipping check for other data types because
      // string: value will always be a string
      // boolean: we convert boolean values automatically
      // datetime: we don't have validations for datetime
      if ((typeRhs === 'value' && dataTypeRhs === 'number' && !isNumber(valueRhs)) ||
          (typeLhs === 'value' && dataTypeLhs === 'number' && !isNumber(valueLhs))) {
        toReturn.isValid = false;
        toReturn.error = 'Value should have correct data type';

        return toReturn;
      }
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
            .off('mouseover')
            .on('mouseover', () => {
              rule.$el.find('.rule-value-container img.settings-icon').show();
              rule.$el
                .find('.rule-value-container img.settings-icon')
                .off('click')
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
            .off('mouseout')
            .on('mouseout', () => {
              rule.$el.find('.rule-value-container img.settings-icon').hide();
            });

          if (rulesState[ruleId].data.rhs.type !== 'value') {
            setTimeout(() => {
              updateUIForRHSRule({ rule, name });
            });
          }
          let rhsValue =
            rulesState[ruleId].data.rhs.value === undefined
              ? ''
              : rulesState[ruleId].data.rhs.value;

          if (rulesState[ruleId].data.rhs.dataType === 'string' && typeof rhsValue === 'string') {
            rhsValue = rhsValue?.replaceAll('"', '&quot;');
          }

          return `<input class="form-control" name="${name}" value="${rhsValue}"><img style="display:none;" class="settings-icon" src="https://d142hkd03ds8ug.cloudfront.net/images/icons/icon/gear.png">`;
        },
        valueGetter(rule, isTouched) {
          const ruleId = getFilterRuleId(rule);
          const r = cloneDeep(rulesState[ruleId].data);
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
            } else if (lhsValue?.endsWith('.length')) {
              const fieldType = filtersMetadata.find(
                metadata => metadata.id === lhsValue
              ).type;

              if (fieldType === 'number') {
                r.lhs.dataType = 'number';
                r.rhs.dataType = 'number';
              }
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
            } else if (rhsValue?.endsWith('.length')) {
              const fieldType = filtersMetadata.find(
                metadata => metadata.id === rhsValue
              ).type;

              if (fieldType === 'number') {
                r.lhs.dataType = 'number';
                r.rhs.dataType = 'number';
              }
            }
          }

          if (!r.rhs.dataType) {
            r.rhs.dataType = 'string';
          }

          // if the rule input is updated, reset the data type
          if (isTouched) {
            if (lhsValue !== r.lhs[r.lhs.type || 'field']) {
              r.lhs.dataType = 'string';
              r.rhs.dataType = 'string';
            }
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
              } else if (lhsValue?.endsWith('.length')) {
                const fieldType = filtersMetadata.find(
                  metadata => metadata.id === lhsValue
                ).type;

                if (fieldType === 'number') {
                  r.lhs.dataType = 'number';
                  r.rhs.dataType = 'number';
                }
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
              } else if (rhsValue?.endsWith('.length')) {
                const fieldType = filtersMetadata.find(
                  metadata => metadata.id === rhsValue
                ).type;

                if (fieldType === 'number') {
                  r.lhs.dataType = 'number';
                  r.rhs.dataType = 'number';
                }
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
              patchEditorValidation(true, vr.error);

              return vr.error;
            }

            if (vr.isValid) {
              return true;
            }

            if (lhsValue && rhsValue) {
              return true;
            }
            patchEditorValidation(true, 'Error');

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

      if (type === 'branchFilter') {
        qbContainer.queryBuilder({
          ...config,
          lang: {
            ...config.lang,
            add_rule: 'Add condition',
            add_group: 'Add conditions group',
          },
          filters: filtersConfig,
          rules,
        });
      }
      if (type === 'ioFilter') {
        qbContainer.queryBuilder({
          ...config,
          filters: filtersConfig,
          rules,
        });
      }
      qbContainer
        .off('rulesChanged.queryBuilder')
        .on('rulesChanged.queryBuilder', () => {
          handleFilterRulesChange();
        });
      qbContainer.queryBuilder('setFilters', true, filtersConfig);

      // don't change the sequence of these events
      qbContainer.on('afterCreateRuleInput.queryBuilder', (e, rule) => {
        rule.filter.valueGetter(rule, true);
        if (type === 'branchFilter') {
          setSkipEmptyRuleCleanup();
        }
      });

      // eslint-disable-next-line no-restricted-syntax
      for (const ruleId in rulesState) {
        if (
          Object.hasOwnProperty.call(rulesState, ruleId) &&
        rulesState[ruleId]?.rule
        ) {
          updateUIForLHSRule({
            rule: rulesState[ruleId].rule,
            name: `${rulesState[ruleId].rule.id}_value_0`,
          });
        }
      }

      if (disabled) {
        setTimeout(() => {
          if (!qbuilder.current) return;

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
  // TODO: 1. only run this code on component mount. we do not want re-order or other actions to remove incomplete rules
  // 2. only need to check if rule length=1.
  // Check with David on dragdrop issue with all but one minimized and many rules in item being dragged...
  useEffect(() => {
    if (type === 'branchFilter') {
    // iterate over rulesState and find empty rules
      if (!rulesState || skipEmptyRuleCleanup) return;

      // console.log('rulesState', rulesState);
      const $qb = jQuery(qbuilder.current);

      Object.keys(rulesState).forEach(ruleId => {
        const state = rulesState[ruleId];

        if (
          typeof state.data.lhs === 'object' &&
        typeof state.data.rhs === 'object'
        ) {
        // console.log('both lhs and rhs have data');
        // eslint-disable-next-line camelcase
          const isSingleInputOperator = !state.rule?.operator?.nb_inputs;

          if (state.data.rhs.type !== 'value' || state.data.rhs.value || state.data.rhs.value === 0 || isSingleInputOperator) return;

          const $emptyRule = state.rule;

          // console.log('delete', $emptyRule);
          $qb.queryBuilder('deleteRule', $emptyRule);
        }
      });
    }
    // validate the query builder on initial render
    isValid();
    // triggering off of filtersMetadata change is key, as it seems to be the last useEffect that runs
    // and thus this effect needs to run AFTER the filtersMetadata changes to persist the removal of empty rules
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
    <>
      <div ref={qbuilder} />
      {showOperandSettingsFor && (
        <OperandSettingsDialog
          ruleData={
            rulesState[getFilterRuleId(showOperandSettingsFor.rule)]?.data[
              showOperandSettingsFor.rhs ? 'rhs' : 'lhs'
            ]
          }
          disabled={disabled}
          onClose={handleCloseOperandSettings}
          onSubmit={handleSubmitOperandSettings}
        />
      )}
    </>
  );
}
