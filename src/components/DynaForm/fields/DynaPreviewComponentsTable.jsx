import React, { Fragment, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { List } from '@material-ui/core';
import DynaCeligoTable from './DynaCeligoTable';

const useStyles = makeStyles(() => ({
  list: {
    paddingTop: 0,
    paddingBottom: 0,
  },
}));

export default function DynaPreviewComponentsTable({ data: objects, columns }) {
  const classes = useStyles();

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
    <List className={classes.list}>
      <>
        <DynaCeligoTable
          title="Flows" collapsable="true" data={componentsMap?.Flow} columns={columns}
          defaultExpand="true" />
      </>
      {Object.keys(componentsMap).map(resourceType => (
        <>
          {resourceType !== 'Flow' && (
            <Fragment key={resourceType}>
              <DynaCeligoTable
                title={`${resourceType}s`} collapsable="true" data={componentsMap[resourceType]} columns={columns} />
            </Fragment>
          )}
        </>
      ))}
    </List>
  );
}
