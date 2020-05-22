import { Fragment, useState, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Drawer, List } from '@material-ui/core';
import UrlEditorDialog from '../../components/AFE/UrlEditor/Dialog';
import MergeEditorDialog from '../../components/AFE/MergeEditor/Dialog';
import FileDefinitionEditorDialog from '../../components/AFE/FileDefinitionEditor/Dialog';
import HttpRequestBodyEditorDialog from '../../components/AFE/HttpRequestBodyEditor/Dialog';
import CsvConfigEditorDialog from '../../components/AFE/CsvConfigEditor/Dialog';
import XmlParseEditorDialog from '../../components/AFE/XmlParseEditor/Dialog';
import TransformEditorDialog from '../../components/AFE/TransformEditor/Dialog';
import JavaScriptEditorDialog from '../../components/AFE/JavaScriptEditor/Dialog';
import SqlQueryBuilderEditorDialog from '../../components/AFE/SqlQueryBuilderEditor/Dialog';
import JsonEditorDialog from '../../components/JsonEditorDialog';
import CeligoPageBar from '../../components/CeligoPageBar';
import FilterEditorDialog from '../../components/AFE/FilterEditor/Dialog';
import SettingsFormEditorDrawer from '../../components/AFE/SettingsFormEditor/Drawer';
import { safeParse } from '../../utils/string';
import WorkArea from './WorkArea';
import EditorListItem from './EditorListItem';

const editors = [
  {
    name: 'UrlEditor',
    label: 'Url editor',
    description:
      'This editor lets you create and test url templates against your raw data.',
  },
  {
    name: 'HttpRequestBodyEditor',
    label: 'Http request body',
    description:
      'This editor lets you create and test json or xml templates against your raw data.',
  },
  {
    name: 'MergeEditor',
    label: 'Merge editor',
    description:
      'This editor lets you merge 2 objects. Typical use is to apply defaults to a record.',
  },
  {
    name: 'CsvParseEditor',
    label: 'CSV parser',
    description: 'This processor converts comma separated values into JSON.',
  },
  {
    name: 'XmlParseEditor',
    label: 'XML parser',
    description:
      'This processor wll convert XML to JSON controlled by an set of parse options.',
  },

  {
    name: 'TransformEditor',
    label: 'Transform editor',
    description:
      'This processor allows a user to "reshape" a json object using simple {extract/generate} pairs.',
  },

  {
    name: 'JavaScriptEditor',
    label: 'JavaScript editor',
    description:
      'This processor allows a user to run javascript safely in our secure jsruntime environment.',
  },
  {
    name: 'FileDefinitionEditor',
    label: 'File-Definition Parser',
    description:
      'This processor allows a user to parse junk data into readable json format by applying file definition structure on it',
  },
  {
    name: 'SQLQueryBuilderEditor',
    label: 'SQL Query Builder editor',
    description:
      'This processor allows user to build Sql Query using handlerbars and json as input to it',
  },
  {
    name: 'JSONEditor',
    label: 'JSON editor',
    description: 'This processor allows user to edit JSON Object',
  },
  {
    name: 'FilterEditor',
    label: 'Filter editor',
    description:
      'This editor allows a user to visually define an expression for filtering records.',
  },
  {
    name: 'SettingsFormEditor',
    label: 'Settings form editor',
    description:
      'This editor allows a user to build a custom form by providing a form definition as JSON and/or a javascript init function.',
  },
];
const useStyles = makeStyles(theme => ({
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
    width: 350,
    height: `calc(100vh - ${theme.spacing(17.5)}px)`,
    padding: theme.spacing(1),
  },

  content: {
    flexGrow: 1,
    // backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

export default function Editors() {
  const classes = useStyles();
  const history = useHistory();
  const [editorName, setEditorName] = useState();
  const [rawData, setRawData] = useState();
  const [rawDataKey, setRawDataKey] = useState(1);
  const [count, setCount] = useState(0);
  const handleEditorChange = useCallback(
    editorName => {
      if (editorName === 'SettingsFormEditor') {
        setCount(count => count + 1);
        history.push('editors/editSettings');
      }

      setEditorName(editorName);
    },
    [history]
  );
  const handleClose = useCallback(
    (shouldCommit, editorValues) => {
      if (shouldCommit) {
        setRawData(editorValues.data);
        setRawDataKey(rawDataKey + 1);
      }

      setEditorName();
    },
    [rawDataKey]
  );
  const currentEditor = useMemo(() => {
    switch (editorName) {
      case 'UrlEditor':
        return (
          <UrlEditorDialog
            title="Create URL template"
            id={editorName}
            data={rawData}
            onClose={handleClose}
          />
        );
      case 'HttpRequestBodyEditor':
        return (
          <HttpRequestBodyEditorDialog
            title="Create HTTP request body"
            id={editorName}
            data={rawData}
            onClose={handleClose}
          />
        );
      case 'MergeEditor':
        return (
          <MergeEditorDialog
            title="Apply default values"
            id={editorName}
            data={rawData}
            onClose={handleClose}
          />
        );

      case 'CsvParseEditor':
        return (
          <CsvConfigEditorDialog
            title="Delimited file parser"
            csvEditorType="parse"
            id={editorName}
            data={rawData}
            onClose={handleClose}
          />
        );

      case 'XmlParseEditor':
        return (
          <XmlParseEditorDialog
            title="XML parser"
            id={editorName}
            data={rawData}
            onClose={handleClose}
          />
        );

      case 'TransformEditor':
        return (
          <TransformEditorDialog
            title="Transform editor"
            id={editorName}
            data={rawData}
            onClose={handleClose}
          />
        );
      case 'JavaScriptEditor':
        return (
          <JavaScriptEditorDialog
            title="Javascript editor"
            id={editorName}
            data={rawData}
            onClose={handleClose}
          />
        );
      case 'FileDefinitionEditor':
        return (
          <FileDefinitionEditorDialog
            title="File definition rules"
            id={editorName}
            data={rawData}
            onClose={handleClose}
          />
        );
      case 'SQLQueryBuilderEditor':
        return (
          <SqlQueryBuilderEditorDialog
            title="SQL query builder"
            id={editorName}
            sampleData={rawData}
            rule="Select * from {{orderId}}"
            data={rawData}
            defaultData={JSON.stringify({}, null, 2)}
            onClose={handleClose}
          />
        );
      case 'JSONEditor':
        return (
          <JsonEditorDialog
            value={rawData}
            title="JSON editor"
            id={editorName}
            onClose={() => {
              this.handleEditorChange(null);
            }}
            onChange={value => {
              // eslint-disable-next-line
              console.log(value);
            }}
          />
        );
      case 'FilterEditor':
        return (
          <FilterEditorDialog
            title="Filter editor"
            id={editorName}
            data={rawData}
            onClose={handleClose}
          />
        );
      default:
        return null;
    }
  }, [editorName, handleClose, rawData]);

  return (
    <Fragment>
      <CeligoPageBar title="Dev playground" />

      <div className={classes.appFrame}>
        <Drawer
          variant="permanent"
          anchor="left"
          classes={{
            paper: classes.drawerPaper,
          }}>
          <List>
            {editors.map(p => (
              <EditorListItem
                key={p.name}
                item={p}
                onClick={handleEditorChange}
              />
            ))}
          </List>
        </Drawer>

        {currentEditor}

        <main className={classes.content}>
          <WorkArea rawData={rawData} onChange={setRawData} />
        </main>
      </div>
      <SettingsFormEditorDrawer
        key={count}
        editorId="settingsForm"
        // resourceId={resourceId}
        // resourceType={resourceType}
        settingsForm={{ form: safeParse(rawData) }}
        // eslint-disable-next-line react/jsx-handler-names
        onClose={history.goBack}
      />
    </Fragment>
  );
}
