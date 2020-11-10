import React, { useState, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Drawer, List } from '@material-ui/core';
import UrlEditorDrawer from '../../components/AFE/UrlEditor/Drawer';
import FileDefinitionEditorDrawer from '../../components/AFE/FileDefinitionEditor/Drawer';
import HttpRequestBodyEditorDrawer from '../../components/AFE/HttpRequestBodyEditor/Drawer';
import CsvConfigEditorDrawer from '../../components/AFE/CsvConfigEditor/Drawer';
import XmlParseEditorDrawer from '../../components/AFE/XmlParseEditor/Drawer';
import TransformEditorDrawer from '../../components/AFE/TransformEditor/Drawer';
import JavaScriptEditorDrawer from '../../components/AFE/JavaScriptEditor/Drawer';
import SqlQueryBuilderEditorDrawer from '../../components/AFE/SqlQueryBuilderEditor/Drawer';
import CeligoPageBar from '../../components/CeligoPageBar';
import FilterEditorDrawer from '../../components/AFE/FilterEditor/Drawer';
import SettingsFormEditorDrawer from '../../components/AFE/SettingsFormEditor/Drawer';
import { safeParse } from '../../utils/string';
import WorkArea from './WorkArea';
import EditorListItem from './EditorListItem';
import ExampleDrawer from '../../components/drawer/Example';

const editors = [
  {
    name: 'UrlEditor',
    label: 'URL editor',
    description:
      'This editor lets you create and test URL templates against your raw data.',
  },
  {
    name: 'HttpRequestBodyEditor',
    label: 'Build HTTP request body',
    description:
      'This editor lets you create and test JSON or XML templates against your raw data.',
  },
  {
    name: 'CsvParseEditor',
    label: 'CSV parser',
    description: 'This processor converts comma-separated values into JSON.',
  },
  {
    name: 'XmlParseEditor',
    label: 'XML parser',
    description:
      'This processor converts XML to JSON, controlled by a set of parse options.',
  },

  {
    name: 'TransformEditor',
    label: 'Transform editor',
    description:
      'This processor allows you to "reshape" a JSON object using simple {extract/generate} pairs.',
  },

  {
    name: 'JavaScriptEditor',
    label: 'JavaScript editor',
    description:
      'This processor allows you to run JavaScript safely in a secure runtime environment.',
  },
  {
    name: 'FileDefinitionEditor',
    label: 'File-definition parser',
    description:
      'This processor allows you to parse junk data into a readable JSON format by applying a file-definition structure.',
  },
  {
    name: 'SQLQueryBuilderEditor',
    label: 'SQL query editor',
    description:
      'This processor allows you to build SQL queries using handlebars and JSON.',
  },
  {
    name: 'FilterEditor',
    label: 'Filter editor',
    description:
      'This editor allows you to visually define an expression for filtering records.',
  },
  {
    name: 'SettingsFormEditor',
    label: 'Settings form editor',
    description:
      'This editor allows you to build a custom form by providing a form definition in JSON and an optional JavaScript initialization function.',
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
  const handleEditorChange = useCallback(
    editorName => {
      history.push(`editors/${editorName}`);
      setEditorName(editorName);
    },
    [history]
  );
  const handleSave = useCallback(
    (shouldCommit, editorValues) => {
      if (shouldCommit) {
        setRawData(editorValues.data);
        setRawDataKey(rawDataKey + 1);
      }
    },
    [rawDataKey]
  );

  const handleClose = useCallback(() => {
    if (editorName === 'SettingsFormEditor') {
      history.goBack();
    }
    setEditorName();
  }, [history, editorName]);

  const currentEditor = useMemo(() => {
    switch (editorName) {
      case 'UrlEditor':
        return (
          <UrlEditorDrawer
            title="Create URL template"
            id={editorName}
            data={rawData}
            onSave={handleSave}
            onClose={handleClose}
          />
        );
      case 'HttpRequestBodyEditor':
        return (
          <HttpRequestBodyEditorDrawer
            title="Create HTTP request body"
            id={editorName}
            data={rawData}
            onSave={handleSave}
            onClose={handleClose}
          />
        );

      case 'CsvParseEditor':
        return (
          <CsvConfigEditorDrawer
            title="Delimited file parser"
            csvEditorType="parse"
            id={editorName}
            data={rawData}
            onSave={handleSave}
            onClose={handleClose}
          />
        );

      case 'XmlParseEditor':
        return (
          <XmlParseEditorDrawer
            title="XML parser"
            id={editorName}
            data={rawData}
            onSave={handleSave}
            onClose={handleClose}
          />
        );

      case 'TransformEditor':
        return (
          <TransformEditorDrawer
            title="Transform editor"
            id={editorName}
            data={rawData}
            onSave={handleSave}
            onClose={handleClose}
          />
        );
      case 'JavaScriptEditor':
        return (
          <JavaScriptEditorDrawer
            title="Javascript editor"
            id={editorName}
            data={rawData}
            onSave={handleSave}
            onClose={handleClose}
          />
        );
      case 'FileDefinitionEditor':
        return (
          <FileDefinitionEditorDrawer
            title="File definition rules"
            id={editorName}
            data={rawData}
            onSave={handleSave}
            onClose={handleClose}
          />
        );
      case 'SQLQueryBuilderEditor':
        return (
          <SqlQueryBuilderEditorDrawer
            title="SQL query builder"
            id={editorName}
            sampleData={rawData}
            rule="Select * from {{orderId}}"
            data={rawData}
            defaultData={JSON.stringify({}, null, 2)}
            onSave={handleSave}
            onClose={handleClose}
          />
        );
      case 'FilterEditor':
        return (
          <FilterEditorDrawer
            title="Filter editor"
            id={editorName}
            data={rawData}
            onSave={handleSave}
            onClose={handleClose}
          />
        );
      case 'SettingsFormEditor':
        return (
          <SettingsFormEditorDrawer
            editorId="settingsForm"
            hideSaveAction="true"
            settingsForm={{ form: safeParse(rawData) }}
            onClose={handleClose}
            path="SettingsFormEditor"
      />
        );
      default:
        return null;
    }
  }, [editorName, handleClose, handleSave, rawData]);

  return (
    <>
      <CeligoPageBar title="Dev playground" />

      <div className={classes.appFrame}>
        <Drawer
          variant="permanent"
          anchor="left"
          classes={{
            paper: classes.drawerPaper,
          }}>
          <List data-public >
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
      <ExampleDrawer />
    </>
  );
}
