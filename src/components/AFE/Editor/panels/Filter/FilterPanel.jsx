import React, { useCallback } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import 'jQuery-QueryBuilder';
import 'jQuery-QueryBuilder/dist/css/query-builder.default.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import actions from '../../../../../actions';
import BranchFilterPanel from '../../../../BranchFilterPanel';

const useStyles = makeStyles(theme => ({
  container: {
    paddingLeft: theme.spacing(1),
    backgroundColor: theme.palette.background.default,
    height: '100%',
    overflowY: 'auto',
  },
}));

export default function FilterPanel({editorId}) {
  const classes = useStyles();
  const rule = useSelector(state => selectors.editorRule(state, editorId));

  // console.log('filter rule from panel:', rule);
  const dispatch = useDispatch();
  const handlePatchEditor = useCallback(
    value => {
      dispatch(actions.editor.patchRule(editorId, value || []));
    },
    [dispatch, editorId]
  );

  // Calculate hash of rule as a key. This is to force a re-render when the rule changes
  // as something in the BranchFilterPanel is not updating correctly on rule changes...
  // const key = JSON.stringify(rule);
  // reverting to avoid regression
  return (
    <div className={classes.container}>
      <BranchFilterPanel
        rule={rule}
        type="ioFilter"
        editorId={editorId}
        handlePatchEditor={handlePatchEditor}
      />
    </div>
  );
}
