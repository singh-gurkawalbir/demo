import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import LoadResources from '../../../../../../components/LoadResources';
import CeligoTable from '../../../../../../components/CeligoTable';
import metadata from '../../../../../../components/ResourceTable/scripts/metadata';
import { selectors } from '../../../../../../reducers';
import { useSelectorMemo } from '../../../../../../hooks';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
}));

export default function ScriptPanel({ flowId }) {
  const classes = useStyles();
  const integrationId = useSelector(state => selectors.resource(state, 'flows', flowId)?._integrationId);
  const flowScripts = useSelectorMemo(selectors.mkGetScriptsTiedToFlow, flowId);

  const actionProps = useMemo(() => ({
    type: 'flowBuilder',
    resourceType: 'scripts',
    integrationId,
    flowId,
  }), [integrationId, flowId]);

  return (
    <div className={classes.root}>
      <LoadResources required resources="scripts">
        <CeligoTable
          data={flowScripts}
          filterKey="scripts"
          {...metadata}
          actionProps={actionProps}
        />
      </LoadResources>
    </div>
  );
}
