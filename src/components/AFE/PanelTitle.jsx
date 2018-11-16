import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

@withStyles(theme => ({
  title: {
    paddingLeft: theme.spacing.unit,
    backgroundColor: theme.palette.primary.main,
    borderBottom: `solid 1px ${theme.palette.primary.light}`,
  },
}))
export default class PanelTitle extends Component {
  render() {
    const { children, classes } = this.props;

    return <div className={classes.title}>{children}</div>;
  }
}
