import React from 'react';
import { useSelector } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import { selectors } from '../../../../../reducers';
import FieldHelp from '../../../../DynaForm/FieldHelp';

const useStyles = makeStyles(theme => ({
  helpTextButton: {
    marginLeft: theme.spacing(-1),
    '& svg': {
      fontSize: 20,
    },
  },
}));
export default function FlowTransformTitleHelp({ editorId }) {
  const classes = useStyles();
  const editorTitle = useSelector(state => selectors.editor(state, editorId).editorTitle);

  return (
    <div className={classes.helpTextButton}>
      <FieldHelp
        noApi
        label={editorTitle}
        helpKey="lookup.transform" />
    </div>
  );
}
