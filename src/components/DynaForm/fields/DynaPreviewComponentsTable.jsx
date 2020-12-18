import React, { useMemo } from 'react';
import DynaCeligoTable from './DynaCeligoTable';

export default function DynaPreviewComponentsTable({ data: objects, columns }) {
  const componentsMap = useMemo(() => {
    if (!objects || !objects.length) return [];

    const result = {};

    objects.forEach(obj => {
      if (!result[obj.model]) {
        result[obj.model] = [];
      }

      result[obj.model].push(obj);
    });

    return result;
  }, [objects]);

  return (
    <>
      <>
        <DynaCeligoTable
          title="Flows" collapsable="true" data={componentsMap?.Flow} columns={columns}
          defaultExpand />
      </>
      {Object.keys(componentsMap).map(resourceType => (
        <>
          {resourceType !== 'Flow' && (
          <DynaCeligoTable
            title={`${resourceType}s`} collapsable="true" data={componentsMap[resourceType]} columns={columns} />
          )}
        </>
      ))}
    </>
  );
}
