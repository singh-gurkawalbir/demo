import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector } from 'react-redux';
import { selectors } from '../../../../../reducers';
import RawHtml from '../../../../RawHtml';

const useStyles = makeStyles(theme => ({
  preview: {
    padding: theme.spacing(1),
    margin: theme.spacing(0, 3),
    overflowY: 'auto',
    flex: 1,
  },
}));

export default function ReadmePanel({ editorId }) {
  const classes = useStyles();
  const rule = useSelector(state => selectors.editorRule(state, editorId));

  return (
    <div className={classes.preview}>
      <RawHtml html={rule} />
    </div>
  );
}
