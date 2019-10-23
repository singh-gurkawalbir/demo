import { useReducer, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';
import {
  Button,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  DialogActions,
  Typography,
} from '@material-ui/core';
import deepClone from 'lodash/cloneDeep';
import DynaAutoSuggest from '../../DynaForm/fields/DynaAutoSuggest';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import CloseIcon from '../../icons/CloseIcon';
import mappingUtil from '../../../utils/mapping';
import * as resourceUtil from '../../../utils/resource';

const useStyles = makeStyles(theme => ({
  modalContent: {
    height: '100vh',
    width: '70vw',
  },
  container: {
    marginTop: theme.spacing(1),
    overflowY: 'off',
  },
  header: {
    height: '100%',
    maxHeight: '28',
  },
  root: {
    flexGrow: 1,
  },
  rowContainer: {
    display: 'flex',
    padding: '0px',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export const reducer = (state, action) => {
  const {
    type,
    value,
    index,
    field,
    lastRowData = {},
    setChangeIdentifier,
  } = action;

  return produce(state, d => {
    const draft = d;

    switch (type) {
      case 'REMOVE':
        setChangeIdentifier(changeIdentifier => changeIdentifier + 1);
        draft.splice(index, 1);
        break;
      case 'UPDATE_FIELD':
        if (state[index]) {
          const objCopy = { ...state[index] };

          objCopy[field] = value;

          draft[index] = objCopy;
        } else if (value) {
          draft.push(Object.assign({}, lastRowData, { [field]: value }));
        }

        setChangeIdentifier(changeIdentifier => changeIdentifier + 1);

        break;

      default:
    }
  });
};

export default function ResponseMappingDialog(props) {
  const { resource, resourceIndex, flowId, resourceType, onClose } = props;
  const { merged: flow = {} } = useSelector(state =>
    selectors.resourceData(state, 'flows', flowId)
  );
  const pageProcessorsObject =
    flow && flow.pageProcessors && flow.pageProcessors[resourceIndex];
  const resourceSubType = resourceUtil.getResourceSubTypeFromAdaptorType(
    resource.adaptorType
  );
  const application = resourceSubType.type;
  const keyName = 'extract';
  const valueName = 'generate';
  const classes = useStyles();
  const dispatch = useDispatch();
  let extractsList =
    resource && resource.responseTransform && resource.responseTransform.rules;

  if (!extractsList) {
    extractsList = mappingUtil.getResponseMappingDefaultExtracts(resourceType);
  }

  const responseMappings =
    pageProcessorsObject && pageProcessorsObject.responseMapping;
  const formattedResponseMapping = mappingUtil.getMappingsForApp({
    mappings: responseMappings,
    appType: application,
  });
  const [state, dispatchLocalAction] = useReducer(
    reducer,
    formattedResponseMapping || []
  );
  const mappingsTmp = deepClone(state);
  const [changeIdentifier, setChangeIdentifier] = useState(0);
  const handleFieldUpdate = (row, event, field) => {
    const { value } = event.target;

    dispatchLocalAction({
      type: 'UPDATE_FIELD',
      index: row,
      field,
      value,
      setChangeIdentifier,
      lastRowData: (mappingsTmp || []).length
        ? mappingsTmp[mappingsTmp.length - 1]
        : {},
    });
  };

  const handleDelete = row => {
    dispatchLocalAction({
      type: 'REMOVE',
      index: row,
      setChangeIdentifier,
      lastRowData: (mappingsTmp || []).length
        ? mappingsTmp[mappingsTmp.length - 1]
        : {},
    });
  };

  mappingsTmp.push({});
  const tableData = (mappingsTmp || []).map((r, n) => ({ ...r, index: n }));
  const handleSubmit = closeModal => {
    let mappings = state.map(({ index, ...others }) => others);

    mappings = mappingUtil.generateMappingsForApp({
      mappings,
      generateFields: [],
      appType: application,
    });
    const patchSet = [];
    let path;

    if (
      pageProcessorsObject &&
      pageProcessorsObject[resourceIndex] &&
      pageProcessorsObject[resourceIndex].responseMapping
    ) {
      const obj = {};

      obj.responseMapping = {};
      obj.type = resourceType === 'imports' ? 'import' : 'export';
      obj[resourceType === 'imports' ? '_importId' : '_exportId'] =
        resource._id;

      path = `/pageProcessors/${resourceIndex}`;
      patchSet.push({
        op: 'add',
        path,
        value: obj,
      });
    }

    path = `/pageProcessors/${resourceIndex}/responseMapping`;
    patchSet.push({ op: 'replace', path, value: mappings });
    dispatch(actions.resource.patchStaged(flowId, patchSet, 'value'));
    dispatch(actions.flowData.updateFlow(flowId));
    dispatch(actions.resource.commitStaged('flows', flowId, 'value'));

    if (closeModal) {
      onClose();
    }
  };

  return (
    <Dialog fullScreen={false} open scroll="paper" maxWidth={false}>
      <IconButton
        aria-label="Close"
        data-test="closeImportMapping"
        className={classes.closeButton}
        onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <DialogTitle disableTypography>
        <Typography variant="h6">Define Response Mapping</Typography> 
      </DialogTitle>
      <DialogContent className={classes.modalContent}>
        <div className={classes.container}>
          <Grid container className={classes.root}>
            <Grid item xs={12} className={classes.header}>
              <Grid container>
                <Grid key="heading_extract" item xs>
                  <span className={classes.alignLeft}>
                    {resourceType === 'imports' ? 'Import' : 'Lookup'} Response
                    Field
                  </span>
                </Grid>
                <Grid key="heading_generate" item xs>
                  <span className={classes.alignLeft}>
                    Source Record Field (New/Existing Field)
                  </span>
                </Grid>
                <Grid key="settings_button_header" item />
              </Grid>
            </Grid>
            <Grid container key={changeIdentifier} direction="column">
              {tableData.map(r => (
                <Grid item className={classes.rowContainer} key={r.index}>
                  <Grid container direction="row">
                    <Grid item xs>
                      <DynaAutoSuggest
                        labelName="name"
                        valueName="id"
                        value={r[keyName]}
                        options={extractsList || []}
                        onBlur={(id, evt) => {
                          handleFieldUpdate(
                            r.index,
                            { target: { value: evt } },
                            keyName
                          );
                        }}
                      />
                    </Grid>
                    <Grid item xs>
                      <DynaAutoSuggest
                        value={r[valueName]}
                        hideOptions
                        onBlur={(id, evt) => {
                          handleFieldUpdate(
                            r.index,
                            { target: { value: evt } },
                            valueName
                          );
                        }}
                      />
                    </Grid>
                    <Grid item key="delete_button">
                      <IconButton
                        data-test="deleteMapping"
                        aria-label="delete"
                        onClick={() => {
                          handleDelete(r.index);
                        }}
                        className={classes.margin}>
                        <CloseIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          data-test="saveMapping"
          onClick={() => handleSubmit(false)}
          variant="contained"
          size="small"
          color="secondary">
          Save
        </Button>
        <Button
          data-test="saveAndCloseMapping"
          onClick={() => handleSubmit(true)}
          variant="contained"
          size="small"
          color="secondary">
          Save and close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
