import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@mui/styles';
import Typography from '@mui/material/Typography';
import RawHtml from '../../RawHtml';
import isLoggableAttr from '../../../utils/isLoggableAttr';

const useStyles = makeStyles(theme => ({
  text: {
    padding: theme.spacing(1, 0),
  },
  label: {
    paddingRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
}));

export default function DynaLabelValueElement(props) {
  const { label, value, id, isLoggable} = props;
  const classes = useStyles(props);

  return (
    <Typography data-test={id} variant="body1" className={classes.text}>
      {/* sanitize html value */}
      <span className={classes.label}>{label}</span>
      <span {...isLoggableAttr(isLoggable)}>
        {/<\/?[a-z][\s\S]*>/i.test(value) ? <RawHtml html={value} /> : value}
      </span>
    </Typography>
  );
}
