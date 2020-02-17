import { useEffect, Fragment, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/OutputFilterIcon';
import helpTextMap from '../../../../components/Help/helpTextMap';
import OutputFilterToggleEditorDialog from '../../../../components/AFE/FilterEditor/FilterToggleEditorDialog';
import { RESOURCE_TYPE_PLURAL_TO_SINGULAR } from '../../../../constants/resource';
import { hooksToFunctionNamesMap } from '../../../../utils/hooks';

function OutputFilterDialog({
  flowId,
  resource,
  isViewMode,
  resourceType,
  onClose,
}) {
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const sampleData = useSelector(state =>
    selectors.getSampleData(state, {
      flowId,
      resourceId,
      resourceType,
      stage: 'outputFilter',
    })
  );
  const { type, rules, scriptId, entryFunction } = useMemo(() => {
    const filterObj = (resource && resource.filter) || {};
    const { type, script = {}, expression = {} } = filterObj;

    return {
      type,
      rules: expression.rules || [],
      scriptId: script._scriptId,
      entryFunction: script.function,
    };
  }, [resource]);
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
  const saveOutputFilter = useCallback(
    values => {
      const { processor, rule, scriptId, entryFunction } = values;
      const filterType = processor === 'filter' ? 'expression' : 'script';
      const path = '/filter';
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
      saveOutputFilter(editorValues);

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
              ].toUpperCase()}_HAS_CONFIGURED_FILTER`
            )
          );
        }
      }
    }

    onClose();
  };

  useEffect(() => {
    if (!sampleData) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          resourceType,
          'outputFilter'
        )
      );
    }
  }, [dispatch, flowId, resourceId, resourceType, sampleData]);

  return (
    <OutputFilterToggleEditorDialog
      title="Define output filter"
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

function OutputFilter(props) {
  const { open } = props;

  return <Fragment>{open && <OutputFilterDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'outputFilter',
  position: 'middle',
  Icon,
  helpText: helpTextMap['fb.pp.exports.filter'],
  Component: OutputFilter,
};
