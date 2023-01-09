import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import 'jQuery-QueryBuilder';
import 'jQuery-QueryBuilder/dist/css/query-builder.default.css';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
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

  return (
    <div className={classes.container}>
      <BranchFilterPanel rule={rule} event="input" editorId={editorId} />
    </div>
  );
}
