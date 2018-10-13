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
        {item.description && <div>{item.description}</div>}
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
          <Link
            className={classes.link}
            to={`/pg/resources/exports/edit/${item._id}`}>
            Edit this Export
          </Link>
          <br />
          <Link className={classes.link} to="/pg/exports/clone">
            Clone this Export
          </Link>
          <br />
          <Link className={classes.link} to="/pg/exports/audit">
            View Audit Log
          </Link>
        </Typography>
      </Fragment>
    );
  }
}
