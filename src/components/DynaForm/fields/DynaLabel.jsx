// @flow
import { useState, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FieldWrapper } from 'react-forms-processor/dist';
import Typography from '@material-ui/core/Typography';
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

function LabelElement(props) {
  const { label, helpKey, helpText } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const classes = useStyles(props);
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
        onMouseEnter={handlePopoverOpen}
        onMouseLeave={handlePopoverClose}
        className={classes.textField}>
        {label}
      </Typography>
    </Fragment>
  );
}

const WrappedDynaLabel = props => (
  <FieldWrapper {...props}>
    <LabelElement />
  </FieldWrapper>
);

export default WrappedDynaLabel;
