/* istanbul ignore file */
import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import FieldHelp from '../FieldHelp';

const useStyles = makeStyles(theme => ({
  textField: {
    width: 'fit-content',
    padding: theme.spacing(1, 1, 1, 0),
  },
}));

export default function DynaLabel(props) {
  const { label, id } = props;
  const classes = useStyles();

  return (
    <Typography
      data-test={id}
      variant="body2"
      className={classes.textField}>
      {label}
      <FieldHelp {...props} />
    </Typography>
  );
}

// This is necessary for this field to be excluded from the form
// submit. Since im not setting this field in this form,
// Im assuming the value on this field is either undefined or ''(This is
// through the defaultValue metadata set in the formFactory) .
// const omitWhenValueIs = [undefined, ''];
// const WrappedDynaLabel = props => (
//   <FieldWrapper {...props} omitWhenValueIs={omitWhenValueIs}>
//     <DynaLabel />
//   </FieldWrapper>
// );

