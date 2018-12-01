import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

@withStyles(theme => ({
  title: {
    paddingLeft: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    borderBottom: `solid 1px ${theme.palette.secondary.light}`,
  },
}))
export default class PanelTitle extends Component {
  render() {
    const { children, classes } = this.props;

    return <div className={classes.title}>{children}</div>;
  }
}
