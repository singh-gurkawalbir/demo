// @flow
import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { FieldWrapper } from 'react-forms-processor/dist';
import Typography from '@material-ui/core/Typography';
import ArrowPopper from '../../ArrowPopper';
import helpTextMap from '../../Help/helpTextMap';

@withStyles(theme => ({
  helpPopper: {
    maxWidth: '350px',
    maxHeight: '300px',
    padding: `${theme.spacing.unit}px ${theme.spacing.double}px`,
    overflow: 'auto',
  },

  textField: {
    paddingTop: theme.spacing.double,
    paddingBottom: theme.spacing.double,
    display: 'inline-block',
    fontSize: theme.typography.fontSize * 1.5,
  },
}))
class LabelElement extends React.Component {
  helpText = (helpText, helpKey) => helpText || helpTextMap[helpKey];
  state = {
    anchorEl: null,
  };

  handlePopoverOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handlePopoverClose = () => {
    this.setState({ anchorEl: null });
  };
  render() {
    const { classes, label, helpKey, helpText } = this.props;
    const { anchorEl } = this.state;
    const helpTextValue = this.helpText(helpText, helpKey);

    return (
      <Fragment>
        <ArrowPopper
          placement="left"
          className={classes.helpPopper}
          id="helpBubble"
          open={!!anchorEl}
          anchorEl={anchorEl}>
          <Typography variant="caption">{helpTextValue}</Typography>
        </ArrowPopper>
        <Typography
          onMouseEnter={this.handlePopoverOpen}
          onMouseLeave={this.handlePopoverClose}
          className={classes.textField}>
          {label}
        </Typography>
      </Fragment>
    );
  }
}

// This is necessary for this field to be excluded from the form
// submit. Since im not setting this field in this form,
// Im assuming the value on this field is either undefined or ''(This is
// through the defaultValue metadata set in the formFactory) .
const omitWhenValueIs = [undefined, ''];
const WrappedDynaLabel = props => (
  <FieldWrapper {...props} omitWhenValueIs={omitWhenValueIs}>
    <LabelElement />
  </FieldWrapper>
);

export default WrappedDynaLabel;
