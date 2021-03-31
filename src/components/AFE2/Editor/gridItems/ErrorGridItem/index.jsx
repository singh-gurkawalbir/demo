import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles, Typography } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import PanelTitle from '../../../../AFE/PanelTitle';
import CodePanel from '../../panels/Code';

const useStyles = makeStyles(theme => ({
  gridItem: {
    border: 'solid 1px rgb(0,0,0,0.3)',
    overflow: 'hidden',
    minWidth: 150,
    minHeight: 100,
    gridArea: 'error',
    marginBottom: theme.spacing(2),
  },

  flexContainer: {
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  panel: { flex: '1 1 100px', minHeight: 50, position: 'relative' },
}));

const overrides = { wrap: true };
export default function ErrorGridItem({ editorId }) {
  const {error, sampleDataStatus} = useSelector(state => selectors._editor(state, editorId));
  const violations = useSelector(state =>
    selectors._editorViolations(state, editorId),
  );
  const classes = useStyles();

  if (sampleDataStatus === 'requested' || (!error && !violations)) return null;
  const errorText = [
    ...(Array.isArray(error) ? error : [error]),
    violations?.ruleError,
    violations?.dataError,
  ]
    .filter(e => !!e)
    .join('\n');

  return (
    <div className={classes.gridItem}>
      <div className={classes.flexContainer}>
        <PanelTitle>
          <Typography color="error">Error</Typography>
        </PanelTitle>
        <div className={classes.panel}>
          <CodePanel
            readOnly
            overrides={overrides}
            mode="text"
            name="error"
            value={errorText}
        />
        </div>
      </div>
    </div>
  );
}
