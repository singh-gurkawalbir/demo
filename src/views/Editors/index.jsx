import { hot } from 'react-hot-loader';
import { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import actions from '../../actions';
import UrlEditorDialog from '../../components/AFE/UrlEditor/Dialog';
import MergeEditorDialog from '../../components/AFE/MergeEditor/Dialog';
import HttpRequestBodyEditorDialog from '../../components/AFE/HttpRequestBodyEditor/Dialog';
import CsvParseEditorDialog from '../../components/AFE/CsvParseEditor/Dialog';
import XmlParseEditorDialog from '../../components/AFE/XmlParseEditor/Dialog';
import TransformEditorDialog from '../../components/AFE/TransformEditor/Dialog';
import WorkArea from './WorkArea';
import EditorListItem from './EditorListItem';

const mapDispatchToProps = dispatch => ({
  updateHelperFunctions: () => {
    dispatch(actions.editor.getHelperFunctions());
  },
});

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
    width: theme.drawerWidth,
    height: `calc(100vh - ${theme.spacing.unit * 7}px)`,
    padding: theme.spacing.unit,
  },

  content: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
  },
}))
class Editors extends Component {
  state = {
    editorName: null,
    rawData: '',
  };
  componentDidMount() {
    // check if you need to update helper functions
    // better to scope the update here
    this.props.updateHelperFunctions();
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
            title="Create URL template"
            id={editorName}
            data={rawData}
            onClose={this.handleClose}
          />
        );
      case 'HttpRequestBodyEditor':
        return (
          <HttpRequestBodyEditorDialog
            title="Create HTTP Request Body"
            id={editorName}
            data={rawData}
            onClose={this.handleClose}
          />
        );
      case 'MergeEditor':
        return (
          <MergeEditorDialog
            title="Apply Default Values"
            id={editorName}
            data={rawData}
            onClose={this.handleClose}
          />
        );

      case 'CsvParseEditor':
        return (
          <CsvParseEditorDialog
            title="Delimited File Parser"
            id={editorName}
            data={rawData}
            onClose={this.handleClose}
          />
        );

      case 'XmlParseEditor':
        return (
          <XmlParseEditorDialog
            title="XML Parser"
            id={editorName}
            // rules={{ attributePrefix: 'test_' }}
            data={rawData}
            onClose={this.handleClose}
          />
        );

      case 'TransformEditor':
        return (
          <TransformEditorDialog
            title="Transform Editor"
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
      {
        name: 'MergeEditor',
        label: 'Merge Editor',
        description:
          'This editor lets you merge 2 objects. Typical use is to apply defaults to a record.',
      },
      {
        name: 'CsvParseEditor',
        label: 'CSV Parser',
        description:
          'This processor converts comma seperated values into JSON.',
      },
      {
        name: 'XmlParseEditor',
        label: 'XML Parser',
        description:
          'This processor wll convert XML to JSON controlled by an set of parse options.',
      },

      {
        name: 'TransformEditor',
        label: 'Transform Editor',
        description:
          'This processor allows a user to "reshape" a json object using simple {extract/generate} pairs.',
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

export default connect(
  null,
  mapDispatchToProps
)(Editors);
