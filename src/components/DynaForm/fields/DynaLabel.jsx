import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import ArrowPopper from '../../ArrowPopper';
import { getHelpTextMap } from '../../Help';
import FieldHelp from '../FieldHelp';

const useStyles = makeStyles(theme => ({
  helpPopper: {
    maxWidth: '350px',
    maxHeight: '300px',
    padding: theme.spacing(1, 2),
    overflow: 'auto',
  },

  textField: {
    width: 'fit-content',
    fontSize: 18,
    padding: theme.spacing(2, 1, 2, 0),
  },
  label: {
    fontSize: 14,
  },
}));

function DynaLabel(props) {
  const { label, helpKey, helpText, id, disablePopover = false } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const showArrowPopper =
    !disablePopover && (helpText || (helpKey && getHelpTextMap()[helpKey]));

  return (
    <>
      {showArrowPopper && (
        <ArrowPopper
          placement="left"
          className={classes.helpPopper}
          id="helpBubble"
          open={!!anchorEl}
          anchorEl={anchorEl}>
          <Typography className={classes.label}>
            {helpText || getHelpTextMap()[helpKey]}
          </Typography>
        </ArrowPopper>
      )}
      <Typography
        data-test={id}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className={classes.textField}>
        {label}
        <FieldHelp {...props} />
      </Typography>
    </>
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

export default DynaLabel;
