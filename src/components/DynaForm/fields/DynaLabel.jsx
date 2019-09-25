import { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { FieldWrapper } from 'react-forms-processor';
import ArrowPopper from '../../ArrowPopper';
import helpTextMap from '../../Help/helpTextMap';

const useStyles = makeStyles(theme => ({
  helpPopper: {
    maxWidth: '350px',
    maxHeight: '300px',
    padding: theme.spacing(1, 2),
    overflow: 'auto',
  },

  textField: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    display: 'inline-block',
    fontSize: theme.typography.fontSize * 1.5,
  },
}));

function DynaLabel(props) {
  const { label, helpKey, helpText, id } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles();
  const handlePopoverOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <ArrowPopper
        placement="left"
        className={classes.helpPopper}
        id="helpBubble"
        open={!!anchorEl}
        anchorEl={anchorEl}>
        <Typography variant="caption">
          {helpText || helpTextMap[helpKey]}
        </Typography>
      </ArrowPopper>
      <Typography
        data-test={id}
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className={classes.textField}>
        {label}
      </Typography>
    </Fragment>
  );
}

// This is necessary for this field to be excluded from the form
// submit. Since im not setting this field in this form,
// Im assuming the value on this field is either undefined or ''(This is
// through the defaultValue metadata set in the formFactory) .
const omitWhenValueIs = [undefined, ''];
const WrappedDynaLabel = props => (
  <FieldWrapper {...props} omitWhenValueIs={omitWhenValueIs}>
    <DynaLabel />
  </FieldWrapper>
);

export default WrappedDynaLabel;
