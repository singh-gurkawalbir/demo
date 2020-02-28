import { useEffect, Fragment, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/InputFilterIcon';
import InputFilterToggleEditorDialog from '../../../../components/AFE/FilterEditor/FilterToggleEditorDialog';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../../../constants/resource';
import { hooksToFunctionNamesMap } from '../../../../utils/hooks';

function InputFilterDialog({
  flowId,
  resource,
  resourceType,
  isViewMode,
  onClose,
}) {
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const { status: sampleDataStatus, data: sampleData } = useSelector(state =>
    selectors.getSampleDataWrapper(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'inputFilter',
    })
  );
  const { type, rules, scriptId, entryFunction } = useMemo(() => {
    const filterObj =
      resource &&
      (resourceType === 'imports' ? resource.filter : resource.inputFilter);
    const { type, script = {}, expression = {} } = filterObj || {};

    return {
      type,
      rules: expression.rules || [],
      scriptId: script._scriptId,
      entryFunction: script.function,
    };
  }, [resource, resourceType]);
  const saveScript = useCallback(
    values => {
      const { code, scriptId } = values;
      const patchSet = [
        {
          op: 'replace',
          path: '/content',
          value: code,
        },
      ];

      dispatch(actions.resource.patchStaged(scriptId, patchSet, 'value'));
      dispatch(actions.resource.commitStaged('scripts', scriptId, 'value'));
    },
    [dispatch]
  );
  const saveInputFilter = useCallback(
    values => {
      const { processor, rule, scriptId, entryFunction } = values;
      const filterType = processor === 'filter' ? 'expression' : 'script';
      const path = resourceType === 'imports' ? '/filter' : '/inputFilter';
      const value = {
        type: filterType,
        expression: {
          version: 1,
          rules: rule || [],
        },
        script: {
          _scriptId: scriptId,
          function: entryFunction,
        },
      };
      const patchSet = [{ op: 'replace', path, value }];

      // Save the resource
      dispatch(actions.resource.patchStaged(resourceId, patchSet, 'value'));
      dispatch(
        actions.resource.commitStaged(resourceType, resourceId, 'value')
      );
    },
    [dispatch, resourceId, resourceType]
  );
  const handleClose = (shouldCommit, editorValues) => {
    if (shouldCommit) {
      const {
        processor,
        rule: filterRules = [],
        scriptId: filterScript,
      } = editorValues;
      const filterType = processor === 'filter' ? 'expression' : 'script';

      if (filterType === 'script') {
        // Incase of script type, save script changes
        saveScript(editorValues);
      }

      // Save Filter rules
      saveInputFilter(editorValues);

      // If there are no filters ( no mapping rules / no script configured ) before
      if ((filterType === 'expression' && !rules.length) || !scriptId) {
        // If user configures filters first time
        if (
          (filterType === 'expression' && filterRules.length) ||
          filterScript
        ) {
          dispatch(
            actions.analytics.gainsight.trackEvent(
              `${RESOURCE_TYPE_PLURAL_TO_SINGULAR[
                resourceType
              ].toUpperCase()}_HAS_CONFIGURED_INCOMING_FILTER`
            )
          );
        }
      }
    }

    onClose();
  };

  useEffect(() => {
    if (!sampleDataStatus) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          resourceType,
          'inputFilter'
        )
      );
    }
  }, [
    dispatch,
    flowId,
    resourceId,
    resourceType,
    sampleData,
    sampleDataStatus,
  ]);

  return (
    <InputFilterToggleEditorDialog
      title="Define Input Filter"
      disabled={isViewMode}
      id={resourceId + flowId}
      data={sampleData}
      type={type}
      rule={rules}
      scriptId={scriptId}
      entryFunction={entryFunction || hooksToFunctionNamesMap.filter}
      insertStubKey="filter"
      onClose={handleClose}
    />
  );
}

function InputFilter(props) {
  const { open } = props;

  return <Fragment>{open && <InputFilterDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'inputFilter',
  position: 'left',
  Icon,
  helpText:
    'This is the text currently in the hover state of actions in the current FB',
  Component: InputFilter,
};
