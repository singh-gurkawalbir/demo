import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import InboxIcon from 'mdi-react/InboxIcon';
import DraftIcon from 'mdi-react/DraftIcon';
import PlusIcon from 'mdi-react/PlusIcon';
import api from '../../../utils/api';
import Spinner from '../../../components/Spinner';
import ErrorPanel from '../../../components/ErrorPanel';
import SpeedDial from '../../../components/SpeedDial';

@hot(module)
@withStyles({
  root: {
    margin: 40,
  },
  empty: {
    textAlign: 'center',
  },
})
export default class CreatePipeline extends Component {
  state = {
    loading: false,
    entries: [],
    showProcessorDialog: false,
    processors: null,
    pipelineValue: null,
  };

  async componentDidMount() {
    this.setState({ loading: true });

    try {
      this.setState({
        processors: await api('/processors'),
        loading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        processors: null,
        loading: false,
        error,
      });
    }
  }

  handleAddProcessorClick = () => {
    this.setState({ showProcessorDialog: true });
  };

  handleEntering = () => {
    this.radioGroup.focus();
  };

  handleProcessorCancel = () => {
    this.setState({ showProcessorDialog: false });
  };

  handleProcessorOK = () => {
    // TODO: set some state to trigger showing the pipeline entry form
    // for this processor
    this.setState({ showProcessorDialog: false });
  };

  handleChange = (e, pipelineValue) => {
    this.setState({ pipelineValue });
  };

  render() {
    const { classes } = this.props;
    const {
      loading,
      processors,
      entries,
      error,
      showProcessorDialog,
      pipelineValue,
    } = this.state;

    if (loading || !processors) {
      return <Spinner loading />;
    }

    if (error) {
      return <ErrorPanel error={error} />;
    }

    return (
      <div className={classes.root}>
        {entries.length ? (
          <List component="nav">
            <ListItem button>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary="Inbox" />
            </ListItem>
            <ListItem button>
              <ListItemIcon>
                <DraftIcon />
              </ListItemIcon>
              <ListItemText primary="Drafts" />
            </ListItem>
          </List>
        ) : (
          <Typography variant="subheading" className={classes.empty}>
            <em>Add a new processor to the data pipeline to get started.</em>
          </Typography>
        )}
        <SpeedDial>
          <SpeedDialAction
            icon={<PlusIcon />}
            tooltipTitle="Add processor"
            onClick={this.handleAddProcessorClick}
          />
        </SpeedDial>
        <Dialog
          open={showProcessorDialog}
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="xs"
          onEntering={this.handleEntering}
          aria-labelledby="confirmation-dialog-title">
          <DialogTitle id="confirmation-dialog-title">
            Select Pipeline
          </DialogTitle>
          <DialogContent>
            <RadioGroup
              ref={node => {
                this.radioGroup = node;
              }}
              aria-label="pipeline"
              name="pipeline"
              value={pipelineValue}
              onChange={this.handleChange}>
              {Object.keys(processors).map(key => (
                <FormControlLabel
                  value={key}
                  key={`processor-option-${key}`}
                  control={<Radio />}
                  label={key}
                />
              ))}
            </RadioGroup>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleProcessorCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleProcessorOK} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
