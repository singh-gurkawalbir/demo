import { hot } from 'react-hot-loader';
import { Component } from 'react';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import { withStyles } from '@material-ui/core/styles';
import UrlEditorDialog from '../../components/AFE/UrlEditor/Dialog';
import MergeEditorDialog from '../../components/AFE/MergeEditor/Dialog';
import FileDefinitionEditorDialog from '../../components/AFE/FileDefinitionEditor/Dialog';
import HttpRequestBodyEditorDialog from '../../components/AFE/HttpRequestBodyEditor/Dialog';
import CsvParseEditorDialog from '../../components/AFE/CsvParseEditor/Dialog';
import XmlParseEditorDialog from '../../components/AFE/XmlParseEditor/Dialog';
import TransformEditorDialog from '../../components/AFE/TransformEditor/Dialog';
import JavaScriptEditorDialog from '../../components/AFE/JavaScriptEditor/Dialog';
import WorkArea from './WorkArea';
import EditorListItem from './EditorListItem';
import SqlQueryBuilderEditorDialog from '../../components/AFE/SqlQueryBuilderEditor/Dialog';

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
export default class Editors extends Component {
  state = {
    editorName: null,
    rawData: '',
  };

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
      case 'JavaScriptEditor':
        return (
          <JavaScriptEditorDialog
            title="Javascript Editor"
            id={editorName}
            data={rawData}
            onClose={this.handleClose}
          />
        );
      case 'FileDefinitionEditor':
        return (
          <FileDefinitionEditorDialog
            title="File definition rules"
            id={editorName}
            data={rawData}
            onClose={this.handleClose}
          />
        );
      case 'SQLQueryBuilderEditor':
        return (
          <SqlQueryBuilderEditorDialog
            title="SQL Query Builder"
            id={editorName}
            sampleData={rawData}
            rule="Select * from {{orderId}}"
            data={rawData}
            defaultData={JSON.stringify({}, null, 2)}
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
          'This processor converts comma separated values into JSON.',
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

      {
        name: 'JavaScriptEditor',
        label: 'JavaScript Editor',
        description:
          'This processor allows a user to run javascript safely in our secure jsruntime environmnet.',
      },
      {
        name: 'FileDefinitionEditor',
        label: 'File-Definition Parser',
        description:
          'This processor allows a user to parse junk data into readable json format by applying file definition sturcture on it',
      },
      {
        name: 'SQLQueryBuilderEditor',
        label: 'SQL Query Builder Editor',
        description:
          'This processor allows user to build Sql Query using handlerbars and json as input to it',
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
