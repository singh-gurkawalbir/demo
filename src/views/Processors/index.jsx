import { hot } from 'react-hot-loader';
import { Component } from 'react';
import { connect } from 'react-redux';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import LoadResources from '../../components/LoadResources';
import * as selectors from '../../reducers';
import Editor from './Editor';
import WorkArea from './WorkArea';
import ProcessorListItem from './ProcessorListItem';

const mapStateToProps = state => ({
  processors: selectors.processors(state),
});
const drawerWidth = 330;

@hot(module)
@withStyles(theme => ({
  appFrame: {
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    width: '100%',
  },

  menuButton: {
    marginLeft: 12,
    marginRight: 20,
  },

  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    height: `calc(100vh - ${theme.spacing.unit * 8}px)`,
    padding: theme.spacing.unit,
  },

  content: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
}))
class Processors extends Component {
  state = {
    processor: null,
    rawData: '',
  };

  componentDidMount() {
    const rawData = JSON.stringify({ a: 123, b: 'abc', c: true }, null, 2);

    this.setState({ rawData });
  }

  handleProcessorChange = processor => {
    this.setState({ processor });
  };

  handleClose = (shouldCommit, editorValues) => {
    const { data } = editorValues;

    if (shouldCommit) {
      this.handleRawDataChange(data);
    }

    this.handleProcessorChange(null);
  };

  handleRawDataChange = rawData => {
    this.setState({ rawData });
  };

  render() {
    const { processors, classes } = this.props;
    const { rawData, processor } = this.state;

    return (
      <LoadResources required resources={['processors']}>
        <div className={classes.appFrame}>
          <Drawer
            variant="permanent"
            anchor="left"
            classes={{
              paper: classes.drawerPaper,
            }}>
            <Typography variant="h6">Available Processors</Typography>
            <List>
              {processors.map(p => (
                <ProcessorListItem
                  key={p.name}
                  item={p}
                  onClick={this.handleProcessorChange}
                />
              ))}
            </List>
          </Drawer>
          <main className={classes.content}>
            <WorkArea rawData={rawData} onChange={this.handleRawDataChange} />
            {processor && (
              <Editor
                id="rawData"
                data={rawData}
                processor={processor}
                onClose={this.handleClose}
              />
            )}
          </main>
        </div>
      </LoadResources>
    );
  }
}

export default connect(mapStateToProps, null)(Processors);
