import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import FieldHelp from '../../../DynaForm/FieldHelp';
import { selectors } from '../../../../reducers';
import editorMetadata from '../../metadata';
import { resolveValue } from '../../../../utils/editor';

const useStyles = makeStyles(theme => ({
  helpTextButton: {
    marginLeft: theme.spacing(-1),
    '& svg': {
      fontSize: 20,
    },
    marginBlock: 'auto',
  },
}));
export default function TitleHelp({ editorId, label }) {
  const classes = useStyles();
  const editorContext = useSelector(state => {
    const e = selectors.editor(state, editorId);

    // add more properties here if required
    return {
      editorType: e.editorType,
      resourceType: e.resourceType,
    };
  }, shallowEqual);

  const {editorType} = editorContext;

  return (
    <div className={classes.helpTextButton}>
      <FieldHelp
        noApi
        label={label}
        helpKey={resolveValue(editorMetadata[editorType].helpKey, editorContext)}
      />
    </div>
  );
}
