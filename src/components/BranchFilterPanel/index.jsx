/* eslint-disable no-param-reassign */
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { isEmpty } from 'lodash';
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
  convertBoolean,
} from '../AFE/Editor/panels/Filter/util';
import OperandSettingsDialog from '../AFE/Editor/panels/Filter/OperandSettingsDialog';
import actions from '../../actions';
import { selectors } from '../../reducers';
import getJSONPaths from '../../utils/jsonPaths';
import { safeParse, isNumber } from '../../utils/string';
import customCloneDeep from '../../utils/customCloneDeep';
import { message } from '../../utils/messageStore';
import {validateRecursive} from '../../utils/filter';

const defaultData = {};

export default function BranchFilterPanel({ editorId, position, type, rule, handlePatchEditor }) {
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

    return selectors.editor(state, editorId)?.skipEmptyRuleCleanup;
  });

  const [showOperandSettingsFor, setShowOperandSettingsFor] = useState();
  const [rules, setRules] = useState();
  const [filtersMetadata, setFiltersMetadata] = useState();
  const [rulesState, setRulesState] = useState({});
  const dispatch = useDispatch();

  const setSkipEmptyRuleCleanup = useCallback(value => {
    if (type === 'branchFilter') {
      dispatch(
        actions.editor.patchRule(editorId, value, {
          actionType: 'setSkipEmptyRuleCleanup',
          position,
        })
      );
    } else {
      dispatch(
        actions.editor.patchFeatures(editorId, {skipEmptyRuleCleanup: value})
      );
    }
  }, [dispatch, type, position, editorId]);

  const patchEditorValidation = useCallback(
    error => {
      const featurePatch = {
        isInvalid: !!error?.length,
        error,
        disablePreview: !!error?.length,
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
  const getRules = useCallback((options = {}) => {
    const result = jQuery(qbuilder.current).queryBuilder('getRules', options);

    if (isEmpty(result) || (result && !result.valid)) {
      return undefined;
    }

    return generateIOFilterExpression(result, context);
  }, [context]);

  const handleFilterRulesChange = useCallback(() => {
    if (isValid()) {
      // reset editor errors
      patchEditorValidation();
      const rule = getRules();

      handlePatchEditor(rule);
    }
  }, [getRules, handlePatchEditor, patchEditorValidation]);
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
        valueField.on(
          'validationError.queryBuilder',
          (_1, _2, error) => patchEditorValidation(error)
        );
        valueField.off('change').on('change', () => {
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
        expressionField.on(
          'validationError.queryBuilder',
          (_1, _2, error) => patchEditorValidation(error)
        );
        expressionField
          .off('change')
          .on('change', () => {
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

    if (
      rule.$el.find('.rule-filter-container img.settings-icon').length === 0
    ) {
      rule.$el
        .find('[name$=_filter]')
        .after(
          // eslint-disable-next-line no-undef
          `<img style="display:none;" class="settings-icon" src="${CDN_BASE_URI}images/icons/icon/gear.png">`
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

    valueField.on(
      'validationError.queryBuilder',
      (_1, _2, error) => patchEditorValidation(error)
    );
    valueField.off('change').on('change', () => handleFilterRulesChange());
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
        field.on(
          'validationError.queryBuilder',
          (_1, _2, error) => patchEditorValidation(error)
        );
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
        expressionField.on(
          'validationError.queryBuilder',
          (_1, _2, error) => patchEditorValidation(error)
        );
        expressionField
          .off('change')
          .on('change', () => {
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
    const arithmeticOperators = [
      'add',
      'subtract',
      'divide',
      'multiply',
      'modulo',
      'ceiling',
      'floor',
      'number',
      'abs',
    ];
    const r = rule.data;
    const toReturn = {
      isValid: true,
      error: '',
    };
    let op;

    if (r.lhs.type === 'expression') {
      try {
        let parsedExp;

        try {
          parsedExp = JSON.parse(r.lhs.expression);
        } catch (ex) {
          throw new Error();
        }

        if (!parsedExp.length || parsedExp.length < 2) {
          toReturn.isValid = false;
          toReturn.error = message.FILTER_PANEL.INVALID_EXPRESSION;
        }
        validateRecursive(parsedExp, null);
      } catch (ex) {
        toReturn.isValid = false;
        toReturn.error = ex.message || message.FILTER_PANEL.INVALID_EXPRESSION_JSON;
      }

      if (toReturn.isValid) {
        [op] = JSON.parse(r.lhs.expression);

        if (arithmeticOperators.includes(op)) {
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
        let parsedExp;

        try {
          parsedExp = JSON.parse(r.rhs.expression);
        } catch (ex) {
          throw new Error();
        }

        if (!parsedExp.length || parsedExp.length < 2) {
          toReturn.isValid = false;
          toReturn.error = message.FILTER_PANEL.INVALID_EXPRESSION;
        }
        validateRecursive(parsedExp, null);
      } catch (ex) {
        toReturn.isValid = false;
        toReturn.error = ex.message || message.FILTER_PANEL.INVALID_EXPRESSION_JSON;
      }

      if (toReturn.isValid) {
        [op] = JSON.parse(r.rhs.expression);

        if (arithmeticOperators.includes(op)) {
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
        toReturn.error = message.FILTER_PANEL.INVALID_DATATYPE;

        return toReturn;
      }

      if (typeRhs === 'value' && dataTypeRhs === 'boolean') {
        const convertedValue = convertBoolean(valueRhs);

        if (typeof convertedValue !== 'boolean') {
          toReturn.isValid = false;
          toReturn.error = convertedValue;

          return toReturn;
        }
      }

      if (typeLhs === 'value' && dataTypeLhs === 'boolean') {
        const convertedValue = convertBoolean(valueLhs);

        if (typeof convertedValue !== 'boolean') {
          toReturn.isValid = false;
          toReturn.error = convertedValue;

          return toReturn;
        }
      }
    }
    /*
      if (r.lhs.dataType === 'epochtime' || r.rhs.dataType === 'epochtime') {
        r.lhs.dataType = r.rhs.dataType = 'epochtime'
      }
      */
    if (r.lhs.dataType && r.rhs.dataType && r.lhs.dataType !== r.rhs.dataType) {
      toReturn.isValid = false;
      toReturn.error = message.FILTER_PANEL.INVALID_DATATYPES_OPERANDS;
    }

    if (!toReturn.isValid) {
      return toReturn;
    }

    if (r.lhs.type && !r.lhs[r.lhs.type]) {
      toReturn.isValid = false;
      toReturn.error = message.FILTER_PANEL.SELECT_LEFT_OPERAND;
    }

    if (!toReturn.isValid) {
      return toReturn;
    }

    if (r.rhs.type && !r.rhs[r.rhs.type]) {
      toReturn.isValid = false;
      toReturn.error = message.FILTER_PANEL.SELECT_RIGHT_OPERAND;
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

          // eslint-disable-next-line no-undef
          return `<input class="form-control" name="${name}" value="${rhsValue}"><img style="display:none;" class="settings-icon" src="${CDN_BASE_URI}images/icons/icon/gear.png">`;
        },
        valueGetter(rule, isTouched) {
          const ruleId = getFilterRuleId(rule);
          const r = customCloneDeep(rulesState[ruleId].data);
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
            } else if (typeof lhsValue === 'string' && lhsValue.endsWith('.length')) {
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
            } else if (typeof rhsValue === 'string' && rhsValue.endsWith('.length')) {
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
              } else if (typeof lhsValue === 'string' && lhsValue.endsWith('.length')) {
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
              } else if (typeof rhsValue === 'string' && rhsValue.endsWith('.length')) {
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
      qbContainer.on(
        'validationError.queryBuilder',
        (_1, _2, error) => patchEditorValidation(error)
      );
      qbContainer
        .off('rulesChanged.queryBuilder')
        .on('rulesChanged.queryBuilder', handleFilterRulesChange);
      qbContainer.queryBuilder('setFilters', true, filtersConfig);

      // don't change the sequence of these events
      qbContainer.on('afterCreateRuleInput.queryBuilder', (e, rule) => {
        rule.filter.valueGetter(rule, true);
        setSkipEmptyRuleCleanup(true);
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
  }, [filtersMetadata, position]);
  // TODO: 1. only run this code on component mount. we do not want re-order or other actions to remove incomplete rules
  // 2. only need to check if rule length=1.
  // Check with David on dragdrop issue with all but one minimized and many rules in item being dragged...
  useEffect(() => {
    // iterate over rulesState and find empty rules
    if (!rulesState || skipEmptyRuleCleanup) return;

    const $qb = jQuery(qbuilder.current);

    Object.keys(rulesState).forEach(ruleId => {
      const state = rulesState[ruleId];

      if (
        typeof state.data.lhs === 'object' &&
        typeof state.data.rhs === 'object'
      ) {
        // eslint-disable-next-line camelcase
        const isSingleInputOperator = !state.rule?.operator?.nb_inputs;

        if (state.data.rhs.type !== 'value' || state.data.rhs.value !== undefined || state.data.rhs.value === 0 || isSingleInputOperator) return;

        const $emptyRule = state.rule;

        $qb.queryBuilder('deleteRule', $emptyRule);
      }
    });
    // triggering off of filtersMetadata change is key, as it seems to be the last useEffect that runs
    // and thus this effect needs to run AFTER the filtersMetadata changes to persist the removal of empty rules
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtersMetadata]);
  useEffect(() => {
    const qbContainer = jQuery(qbuilder.current);

    qbContainer.off('afterCreateRuleInput.queryBuilder')
      .on('afterCreateRuleInput.queryBuilder', (e, rule) => {
        rule.filter.valueGetter(rule, true);
        setSkipEmptyRuleCleanup(true);
      });
  }, [position, filtersMetadata, type, setSkipEmptyRuleCleanup]);

  // On component unmount,
  // 1. Reset editor validations,
  // 2. Cleanup any empty rules on remount,
  // this useEffect handles switching between rules and javascript panels
  useEffect(() => () => {
    patchEditorValidation();
    setSkipEmptyRuleCleanup(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
