import React from 'react';
import { useSelector } from 'react-redux';
import {makeStyles} from '@material-ui/core/styles';
import FieldHelp from '../../../../../DynaForm/FieldHelp';
import { selectors } from '../../../../../../reducers';

const useStyles = makeStyles(theme => ({
  helpTextButton: {
    marginLeft: theme.spacing(-1),
    '& svg': {
      fontSize: 20,
    },
  },
}));
export default function TitleHelp({ editorId }) {
  const classes = useStyles();
  const resourceType = useSelector(state => selectors.editor(state, editorId).resourceType);
  const editorTitle = useSelector(state => selectors.editor(state, editorId).editorTitle);
  const helpKey = resourceType === 'exports' ? 'lookup.response.mapping' : 'import.response.mapping';

  return (
    <div className={classes.helpTextButton}>
      <FieldHelp
        noApi
        label={editorTitle}
        helpKey={helpKey} />
    </div>
  );
}
