import React, { useMemo } from 'react';
import Icon from '../../../../components/icons/OutputFilterIcon';
import ExportFilterToggleEditorDrawer from '../../../../components/AFE2/Editor/FilterToggle';
import { hooksToFunctionNamesMap } from '../../../../utils/hooks';

function ExportFilterDrawer({ flowId, resource, isViewMode, onClose }) {
  const resourceId = resource._id;
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

  // const optionalSaveParams = useMemo(
  //   () => ({
  //     processorKey: 'exportFilter',
  //     resourceId,
  //     resourceType: 'exports',
  //     rules,
  //   }),
  //   [resourceId, rules]
  // );

  return (
    <ExportFilterToggleEditorDrawer
      title="Define output filter"
      helpTitle="Filter rules"
      helpKey="export.filter.rules"
      disabled={isViewMode}
      id={resourceId}
      // data={sampleData}
      type={type}
      rule={rules}
      scriptId={scriptId}
      entryFunction={entryFunction || hooksToFunctionNamesMap.filter}
      insertStubKey="filter"
      onClose={onClose}
      // optionalSaveParams={optionalSaveParams}
      // isSampleDataLoading={sampleDataStatus === 'requested'}
      flowId={flowId}
      resourceType="exports"
      path="exportFilter"
    />
  );
}

function FilterDrawer(props) {
  const { open } = props;

  return <>{open && <ExportFilterDrawer {...props} />}</>;
}

export default {
  // used to create data-test attribute and component key. Should be unique across FB actions.
  name: 'exportFilter',
  position: 'right',
  Icon,
  helpKey: 'fb.pg.exports.filter',
  Component: FilterDrawer,
};
