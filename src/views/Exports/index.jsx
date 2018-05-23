import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Spinner from '../../components/Spinner';
import ErrorPanel from '../../components/ErrorPanel';
import api from '../../utils/api';

@hot(module)
@withStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 400,
  },
  paper: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
  }),
}))
export default class Exports extends Component {
  state = {
    loading: false,
    exports: [],
    // page: 0,
  };

  async componentDidMount() {
    this.setState({ loading: true });

    try {
      this.setState({
        exports: await api('/exports'),
        loading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        exports: null,
        loading: false,
        error,
      });
    }
  }

  render() {
    const { classes } = this.props;
    const {
      loading,
      exports,
      error,
      // page
    } = this.state;

    if (loading) {
      return <Spinner loading />;
    }

    if (!exports) {
      return (
        <Paper className={classes.paper} elevation={4}>
          <Typography variant="headline" component="h3">
            You have no exports.
          </Typography>
          <Typography component="p">
            You can create new Exports by logging into:
            {process.env.API_ENDPOINT}.
          </Typography>
        </Paper>
      );
    }

    if (error) {
      return <ErrorPanel error={error} />;
    }

    return (
      <Fragment>
        <Typography variant="display1">These are your exports</Typography>
        <Link to="/">Home</Link>

        <Paper className={classes.root}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell numeric>Last Modified</TableCell>
                <TableCell numeric>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {exports.map(e => (
                <TableRow key={e.id}>
                  <TableCell component="th" scope="row">
                    {e.name || e.id}
                  </TableCell>
                  <TableCell numeric>{e.lastModified}</TableCell>
                  <TableCell numeric>{e.type}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </Fragment>
    );
  }
}
