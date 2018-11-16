import { hot } from 'react-hot-loader';
import { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import UrlEditorDialog from '../../components/AFE/EditorDialog/UrlEditorDialog';
import HttpRequestBodyEditorDialog from '../../components/AFE/EditorDialog/HttpRequestBodyEditorDialog';
import WorkArea from './WorkArea';
import EditorListItem from './EditorListItem';

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
export default class Editors extends Component {
  state = {
    editorName: null,
    rawData: '',
  };

  componentDidMount() {
    const rawData = JSON.stringify({ a: 123, b: 'abc', c: true }, null, 2);

    this.setState({ rawData });
  }

  handleEditorChange = editorName => {
    this.setState({ editorName });
  };

  handleClose = (shouldCommit, editorValues) => {
    const { data } = editorValues;

    if (shouldCommit) {
      this.handleRawDataChange(data);
    }

    this.handleEditorChange(null);
  };

  handleRawDataChange = rawData => {
    this.setState({ rawData });
  };

  getEditor = () => {
    const { editorName, rawData } = this.state;

    switch (editorName) {
      case 'UrlEditor':
        return (
          <UrlEditorDialog
            id={editorName}
            data={rawData}
            onClose={this.handleClose}
          />
        );
      case 'HttpRequestBodyEditor':
        return (
          <HttpRequestBodyEditorDialog
            id={editorName}
            data={rawData}
            onClose={this.handleClose}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { classes } = this.props;
    const { rawData, editorName } = this.state;
    const editors = [
      {
        name: 'UrlEditor',
        label: 'Url Editor',
        description:
          'This editor lets you create and test url templates against your raw data.',
      },
      {
        name: 'HttpRequestBodyEditor',
        label: 'Http Request Body',
        description:
          'This editor lets you create and test json or xml templates against your raw data.',
      },
    ];

    return (
      <div className={classes.appFrame}>
        <Drawer
          variant="permanent"
          anchor="left"
          classes={{
            paper: classes.drawerPaper,
          }}>
          <Typography align="center" variant="h6">
            Available Editors
          </Typography>
          <List>
            {editors.map(p => (
              <EditorListItem
                key={p.name}
                item={p}
                onClick={this.handleEditorChange}
              />
            ))}
          </List>
        </Drawer>

        {editorName && this.getEditor()}

        <main className={classes.content}>
          <WorkArea rawData={rawData} onChange={this.handleRawDataChange} />
        </main>
      </div>
    );
  }
}
