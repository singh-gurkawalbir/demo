import { useEffect, Fragment, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as selectors from '../../../../reducers';
import actions from '../../../../actions';
import Icon from '../../../../components/icons/OutputFilterIcon';
import ExportFilterToggleEditorDialog from '../../../../components/AFE/FilterEditor/FilterToggleEditorDialog';
import helpTextMap from '../../../../components/Help/helpTextMap';
import { hooksToFunctionNamesMap } from '../../../../utils/hooks';

function ExportFilterDialog({ flowId, resource, isViewMode, onClose }) {
  const dispatch = useDispatch();
  const resourceId = resource._id;
  const { status: sampleDataStatus, data: sampleData } = useSelector(state =>
    selectors.getSampleDataWrapper(state, {
      flowId,
      resourceId,
      resourceType: 'exports',
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
  const saveExportFilter = useCallback(
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
      dispatch(actions.resource.commitStaged('exports', resourceId, 'value'));
    },
    [dispatch, resourceId]
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
      saveExportFilter(editorValues);

      // If there are no filters ( no mapping rules / no script configured ) before
      if ((filterType === 'expression' && !rules.length) || !scriptId) {
        // If user configures filters first time
        if (
          (filterType === 'expression' && filterRules.length) ||
          filterScript
        ) {
          dispatch(
            actions.analytics.gainsight.trackEvent(
              'EXPORT_HAS_CONFIGURED_FILTER'
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
          'exports',
          'outputFilter'
        )
      );
    }
  }, [dispatch, flowId, resourceId, sampleDataStatus]);

  return (
    <ExportFilterToggleEditorDialog
      title="Define output filter"
      disabled={isViewMode}
      id={resourceId}
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

function FilterDialog(props) {
  const { open } = props;

  return <Fragment>{open && <ExportFilterDialog {...props} />}</Fragment>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'exportFilter',
  position: 'right',
  Icon,
  helpText: helpTextMap['fb.pg.exports.filter'],
  Component: FilterDialog,
};
