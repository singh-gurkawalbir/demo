import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import PanelTitle from '../PanelTitle';
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
  title: { color: theme.palette.warning.main },
  panel: { flex: '1 1 100px', minHeight: 50, position: 'relative' },
}));

const overrides = { wrap: true };
export default function WarningGridItem({ editorId }) {
  const classes = useStyles();
  const sampleDataStatus = useSelector(state => selectors.editor(state, editorId).sampleDataStatus);
  const { warning } = useSelector(state => selectors.editorResult(state, editorId));

  if (!warning || sampleDataStatus === 'requested') return null;

  return (
    <div className={classes.gridItem}>
      <div className={classes.flexContainer}>
        <PanelTitle className={classes.title} title="Warning" />
        <div className={classes.panel}>
          <CodePanel
            readOnly
            overrides={overrides}
            mode="text"
            name="warning"
            value={warning}
        />
        </div>
      </div>
    </div>
  );
}
