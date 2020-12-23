import React, { useMemo } from 'react';
import { RESOURCE_TYPE_LABEL_TO_SINGULAR, RESOURCE_TYPE_SINGULAR_TO_PLURAL } from '../../../constants/resource';
import DynaCeligoTable from './DynaCeligoTable';

export default function DynaPreviewComponentsTable({ data: objects, columns, resourceType: cloneResourceType }) {
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
      {!['exports', 'imports'].includes(cloneResourceType) && (
      <DynaCeligoTable
        title="Flows"
        collapsable
        data={componentsMap?.Flow}
        columns={columns}
        defaultExpand />
      )}
      {Object.keys(componentsMap).map(resourceType => (
        <>
          {resourceType !== 'Flow' && (
          <DynaCeligoTable
            title={`${resourceType}s`}
            collapsable
            data={componentsMap[resourceType]}
            columns={columns}
            defaultExpand={cloneResourceType === RESOURCE_TYPE_SINGULAR_TO_PLURAL[RESOURCE_TYPE_LABEL_TO_SINGULAR[resourceType]]}
            />
          )}
        </>
      ))}
    </>
  );
}
