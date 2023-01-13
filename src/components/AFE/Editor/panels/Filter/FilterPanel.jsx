import React, { useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'jQuery-QueryBuilder';
import 'jQuery-QueryBuilder/dist/css/query-builder.default.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import BranchFilterPanel from '../../../../BranchFilterPanel';
import actions from '../../../../../actions';

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
  const dispatch = useDispatch();
  const handlePatchEditor = useCallback(
    value => {
      dispatch(actions.editor.patchRule(editorId, value || []));
    },
    [dispatch, editorId]
  );

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
