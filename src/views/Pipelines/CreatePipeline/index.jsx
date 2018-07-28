import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
// import ExpansionPanel from '@material-ui/core/ExpansionPanel';
// import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
// import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
// import Typography from '@material-ui/core/Typography';
// import List from '@material-ui/core/List';
// import ListItem from '@material-ui/core/ListItem';
// import ListItemIcon from '@material-ui/core/ListItemIcon';
// import ListItemText from '@material-ui/core/ListItemText';
// import Typography from '@material-ui/core/Typography';
import ArrowDownIcon from 'mdi-react/ArrowDownIcon';
// import DraftIcon from 'mdi-react/DraftIcon';
import api from '../../../utils/api';
import Spinner from '../../../components/Spinner';
import ErrorPanel from '../../../components/ErrorPanel';
import CodeEditor from '../../../components/CodeEditor';
import ProcessorPanel from '../../../components/ProcessorPanel';

// Handlebars processor takes in JSON, rules are text templates,
// output is indeterminate, but can be typed
// JavaScript processor takes in args and outputs anything

// All parsers take text/string in, and output JSON
// XML processor is text in, XML out
//

@hot(module)
@withStyles(theme => ({
  root: {
    margin: 80,
  },
  actionItems: {
    margin: `${theme.spacing.triple}px 0`,
  },
  actionItem: {
    textAlign: 'center',
  },
  icon: {
    verticalAlign: 'middle',
    marginRight: theme.spacing.quad,
  },
  formControlWrapper: {
    textAlign: 'right',
  },
  formControl: {
    textAlign: 'left',
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  expansionSelect: {
    width: '50%',
  },
  selectEmpty: {
    marginTop: theme.spacing.double,
  },
}))
export default class CreatePipeline extends Component {
  state = {
    loading: false,
    input: '',
    parseAs: 'text',
    usingProcessors: [],
    // showProcessorDialog: false,
    processors: null,
    // pipelineValue: null,
  };

  async componentDidMount() {
    this.setState({ loading: true });

    try {
      this.setState({
        processors: Object.values(await api('/processors')),
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

  // handleAddProcessorClick = () => {
  //   this.setState({ showProcessorDialog: true });
  // };
  //
  // handleEntering = () => {
  //   this.radioGroup.focus();
  // };
  //
  // handleProcessorCancel = () => {
  //   this.setState({ showProcessorDialog: false });
  // };
  //
  // handleProcessorOK = () => {
  //   // TODO: set some state to trigger showing the pipeline entry form
  //   // for this processor
  //   this.setState({ showProcessorDialog: false });
  // };
  //
  // handleChange = (e, pipelineValue) => {
  //   this.setState({ pipelineValue });
  // };

  handleInputChange = input => {
    this.setState({ input });
  };

  handleParseChange = e => {
    this.setState({ parseAs: e.target.value });
  };

  handleAddClick = () => {
    this.setState({
      usingProcessors: [
        ...this.state.usingProcessors,
        { id: this.state.usingProcessors.length },
      ],
    });
  };

  handleProcessorChange = (processor, nextProcessor) => {
    const index = this.state.usingProcessors.findIndex(
      ({ id }) => id === processor.id
    );
    const usingProcessors = [...this.state.usingProcessors];

    usingProcessors[index] = {
      ...processor,
      ...nextProcessor,
    };

    this.setState({
      usingProcessors,
    });
  };

  render() {
    const { classes } = this.props;
    const {
      loading,
      processors,
      usingProcessors,
      error,
      input,
      parseAs,
    } = this.state;

    return (
      <div className={classes.root}>
        {loading && <Spinner loading />}
        {error && <ErrorPanel error={error} />}
        <div className={classes.formControlWrapper}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="parseAs">Parse input as:</InputLabel>
            <Select
              className={classes.selectEmpty}
              value={parseAs}
              onChange={this.handleParseChange}
              name="parseAs">
              <MenuItem value="json">JSON</MenuItem>
              <MenuItem value="xml">XML</MenuItem>
              <MenuItem value="ldjson">Line-delimited JSON</MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="text">Plain Text</MenuItem>
            </Select>
          </FormControl>
        </div>
        <CodeEditor value={input} onChange={this.handleInputChange} />
        {usingProcessors &&
          usingProcessors.length &&
          usingProcessors.map(processor => (
            <ProcessorPanel
              key={processor.id}
              processors={processors}
              processor={processor}
              onProcessorChange={this.handleProcessorChange}
            />
          ))}
        <Grid container className={classes.actionItems}>
          <Grid item xs={6} className={classes.actionItem}>
            <ArrowDownIcon className={classes.icon} />
          </Grid>
          <Grid item xs={6} className={classes.actionItem}>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              onClick={this.handleAddClick}>
              Add a new processor
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}
