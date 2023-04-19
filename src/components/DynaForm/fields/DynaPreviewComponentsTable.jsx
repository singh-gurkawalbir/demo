import React, { useMemo } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { RESOURCE_TYPE_LABEL_TO_SINGULAR, RESOURCE_TYPE_SINGULAR_TO_PLURAL } from '../../../constants/resource';
import DynaCeligoTable from './DynaCeligoTable';
import { mappingFlowsToFlowGroupings } from '../../../utils/flows';
import customCloneDeep from '../../../utils/customCloneDeep';

const useStyles = makeStyles(theme => ({
  previewTableWrapper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  accordianWrapper: {
    marginBottom: theme.spacing(2),
    width: '100%',
  },
}));

export default function DynaPreviewComponentsTable({ data: objects, useColumns, resourceType: cloneResourceType }) {
  const classes = useStyles();
  const componentsMap = useMemo(() => {
    if (!objects || !objects.length) return [];

    const result = {};

    const flowGroupings = objects.find(obj => obj.model === 'Integration')?.doc?.flowGroupings;

    objects.forEach(obj => {
      let resourceType;

      if (obj.model === 'AsyncHelper') {
        resourceType = 'Async helper';
      } else if (obj.model === 'FileDefinition') {
        resourceType = 'File definition';
      } else {
        resourceType = obj.model;
      }

      if (!result[resourceType]) {
        result[resourceType] = [];
      }

      result[resourceType].push(obj);
    });

    result.Flow = [...(mappingFlowsToFlowGroupings(flowGroupings, result.Flow, objects.length) || [])];

    return result;
  }, [objects]);

  return (
    <>
      {!['exports', 'imports'].includes(cloneResourceType) && (
      <DynaCeligoTable
        title="Flows"
        collapsable
        className={classes.accordianWrapper}
        data={customCloneDeep(componentsMap?.Flow)}
        useColumns={useColumns}
        defaultExpand />
      )}
      {Object.keys(componentsMap).map(resourceType => (
        <div key={resourceType}>
          {resourceType !== 'Flow' && (
          <DynaCeligoTable
            className={classes.previewTableWrapper}
            title={`${resourceType}s`}
            collapsable
            data={componentsMap[resourceType]}
            useColumns={useColumns}
            defaultExpand={cloneResourceType !== 'integrations' && cloneResourceType === RESOURCE_TYPE_SINGULAR_TO_PLURAL[RESOURCE_TYPE_LABEL_TO_SINGULAR[resourceType]]}
            />
          )}
        </div>
      ))}
    </>
  );
}
