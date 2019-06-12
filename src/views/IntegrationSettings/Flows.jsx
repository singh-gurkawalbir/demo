import { Component } from 'react';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { withStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import * as selectors from '../../reducers';
import LoadResources from '../../components/LoadResources';
import { STANDALONE_INTEGRATION } from '../../utils/constants';

const mapStateToProps = (state, { match }) => {
  const { integrationId } = match.params;
  let flows = selectors.resourceList(state, { type: 'flows' }).resources;
  const preferences = selectors.userProfilePreferencesProps(state);

  flows =
    flows &&
    flows.filter(
      f =>
        f._integrationId ===
          (integrationId === STANDALONE_INTEGRATION.id
            ? undefined
            : integrationId) &&
        !!f.sandbox === (preferences.environment === 'sandbox')
    );

  return {
    flows,
  };
};

@withStyles(theme => ({
  title: {
    marginBottom: theme.spacing.unit * 2,
    float: 'left',
  },
}))
class Flows extends Component {
  render() {
    const { classes, flows } = this.props;

    return (
      <LoadResources required resources="flows">
        <Typography className={classes.title} variant="h4">
          Integration Flows
        </Typography>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Flow Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Field Mappings</TableCell>
              <TableCell>Schedule</TableCell>
              <TableCell>Run</TableCell>
              <TableCell>Off/On</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {flows &&
              flows.map(flow => (
                <TableRow key={flow._id}>
                  <TableCell>
                    <NavLink
                      activeClassName={classes.activeLink}
                      className={classes.link}
                      to={`flows/${flow._id}/edit`}>
                      {flow.name}
                    </NavLink>
                  </TableCell>
                  <TableCell>{flow.description}</TableCell>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </LoadResources>
    );
  }
}

export default connect(mapStateToProps)(Flows);
