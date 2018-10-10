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
export default class Exports extends Component {
  render() {
    const { classes, item } = this.props;

    return (
      <Fragment>
        <Typography className={classes.exportDetails}>
          Created on {new Date(item.lastModified).toLocaleDateString()}
          <br />
          {item.connection && (
            <span>
              Using a {item.connection.type} connection named:
              {item.connection.name || item.connection._id}
            </span>
          )}
        </Typography>
        <Typography className={classes.secondaryHeading}>
          <Link className={classes.link} to={`/pg/export/preview/${item._id}`}>
            Preview this Export
          </Link>
          <br />
          <Link className={classes.link} to="/pg/export/clone">
            Clone this Export
          </Link>
          <br />
          <Link className={classes.link} to="/pg/export/publish">
            Publish export data to Data Pipeline
          </Link>
          <br />
          <Link className={classes.link} to="/pg/export/clone">
            View Audit Log
          </Link>
        </Typography>
      </Fragment>
    );
  }
}
