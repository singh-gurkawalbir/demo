import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import ArrowExpandDownIcon from 'mdi-react/ArrowExpandDownIcon';
import PlusIcon from 'mdi-react/PlusIcon';
import storage from '../../../utils/storage';
import Spinner from '../../../components/Spinner';
import ErrorPanel from '../../../components/ErrorPanel';
import SpeedDial from '../../../components/SpeedDial';

const PIPELINES = '@@PIPELINES';

@hot(module)
@withStyles({
  root: {
    margin: 40,
  },
  empty: {
    textAlign: 'center',
  },
})
export default class ListPipelines extends Component {
  state = {
    pipelines: null,
    loading: false,
    error: null,
  };

  async componentDidMount() {
    this.setState({ loading: true });

    try {
      this.setState({
        pipelines: (await storage.getItem(PIPELINES)) || [],
        error: null,
        loading: false,
      });
    } catch (err) {
      this.setState({
        pipelines: null,
        loading: false,
        error: err,
      });
    }
  }

  handleAddPipelineClick = () => {
    this.props.history.push('/pipelines/create');
  };

  render() {
    const { classes } = this.props;
    const { loading, pipelines, error } = this.state;

    if (loading || !pipelines) {
      return <Spinner loading />;
    }

    if (error) {
      return <ErrorPanel error={error} />;
    }

    return (
      <div className={classes.root}>
        {pipelines.length ? (
          <List component="nav">
            {pipelines.map(({ id, name }) => (
              <ListItem button key={id}>
                <ListItemIcon>
                  <ArrowExpandDownIcon />
                </ListItemIcon>
                <ListItemText primary={name} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="subheading" className={classes.empty}>
            <em>Create a new pipeline to get started.</em>
          </Typography>
        )}
        <SpeedDial>
          <SpeedDialAction
            icon={<PlusIcon />}
            tooltipTitle="Add pipeline"
            onClick={this.handleAddPipelineClick}
          />
        </SpeedDial>
      </div>
    );
  }
}
