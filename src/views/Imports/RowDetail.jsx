import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

@hot(module)
@withStyles(theme => ({
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(12),
    color: theme.palette.text.secondary,
  },
  link: {
    color: theme.palette.text.secondary,
    // color: theme.palette.action.active,
  },
  exportDetails: {
    flexBasis: '66.66%',
    flexShrink: 0,
  },
}))
export default class Imports extends Component {
  render() {
    const { classes, item } = this.props;

    return (
      <Fragment>
        <Typography className={classes.exportDetails}>
          Created on {new Date(item.lastModified).toLocaleDateString()}
          <br />
          Using a {item.connection.type.toUpperCase()} connection named:
          {item.connection.name}
        </Typography>
        <Typography className={classes.secondaryHeading}>
          <Link className={classes.link} to={`/pg/imports/preview/${item._id}`}>
            Preview this Import
          </Link>
          <br />
          <Link className={classes.link} to="/pg/impors/clone">
            Clone this Import
          </Link>
          <br />
          <Link className={classes.link} to="/pg/imports/audit">
            View Audit Log
          </Link>
        </Typography>
      </Fragment>
    );
  }
}
