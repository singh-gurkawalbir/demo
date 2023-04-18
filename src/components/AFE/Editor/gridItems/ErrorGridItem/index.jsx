import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core';
import { selectors } from '../../../../../reducers';
import PanelTitle from '../PanelTitle';
import CodePanel from '../../panels/Code';

const useStyles = makeStyles(theme => ({
  gridItem: {
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
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
  panel: {
    flex: '1 1 100px',
    minHeight: 50,
    position: 'relative',
  },
}));

const overrides = { wrap: true };
export default function ErrorGridItem({ editorId }) {
  const {error, sampleDataStatus, chatErrors} = useSelector(state => {
    const editorState = selectors.editor(state, editorId);
    const {error, sampleDataStatus, chat = {}} = editorState;
    const {errors: chatErrors} = chat;

    return {error, sampleDataStatus, chatErrors};
  });

  const violations = useSelector(state =>
    selectors.editorViolations(state, editorId),
  );
  const classes = useStyles();

  if (sampleDataStatus === 'requested' || (!error && !violations && !chatErrors)) return null;

  const errorText = [
    ...(Array.isArray(error) ? error : [error]),
    violations?.ruleError,
    violations?.dataError,
    ...chatErrors || [],
  ]
    .filter(e => !!e)
    .join('\n');

  return (
    <div className={classes.gridItem}>
      <div className={classes.flexContainer}>
        <PanelTitle titleColor="error" title="Error" />
        <div className={classes.panel} data-private>
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
