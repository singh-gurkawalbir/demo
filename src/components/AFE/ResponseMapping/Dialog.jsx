import { useReducer, useState, useEffect } from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useSelector, useDispatch } from 'react-redux';
import produce from 'immer';
import Button from '@material-ui/core/Button';
import deepClone from 'lodash/cloneDeep';
import DynaTypeableSelect from '../../DynaForm/fields/DynaTypeableSelect';
import * as selectors from '../../../reducers';
import actions from '../../../actions';
import TrashIcon from '../../icons/TrashIcon';
import mappingUtil from '../../../utils/mapping';
import getJSONPaths from '../../../utils/jsonPaths';
import * as resourceUtil from '../../../utils/resource';
import ModalDialog from '../../ModalDialog';
import ButtonGroup from '../../ButtonGroup';
import ActionButton from '../../ActionButton';

// TODO Aditya: Convert Response Mapping and Import mapping to re-use same component
// TODO: Azhar once Mapping dialog design is ready make a component
const useStyles = makeStyles(theme => ({
  container: {
    marginTop: theme.spacing(1),
    overflowY: 'off',
  },
  header: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '45% 45% 50px',
    gridColumnGap: '1%',
    marginBottom: theme.spacing(0.5),
  },
  rowContainer: {
    display: 'block',
    padding: '0px',
  },
  child: {
    '& + div': {
      width: '100%',
    },
  },
  childHeader: {
    '& > div': {
      width: '100%',
    },
  },
  innerRow: {
    display: 'grid',
    width: '100%',
    gridTemplateColumns: '45% 45% 50px 50px',
    marginBottom: theme.spacing(1),
    gridColumnGap: '1%',
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
          draft.push({ ...lastRowData, [field]: value });
        }

        setChangeIdentifier(changeIdentifier => changeIdentifier + 1);

        break;

      default:
    }
  });
};

export default function ResponseMappingDialog(props) {
  const {
    resource,
    resourceIndex,
    flowId,
    resourceType,
    onClose,
    disabled,
  } = props;
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
  const resourceId = resource._id;
  const extractFields = useSelector(state =>
    selectors.getSampleData(state, {
      flowId,
      resourceId,
      stage: 'responseMappingExtract',
      resourceType,
    })
  );

  useEffect(() => {
    if (!extractFields) {
      dispatch(
        actions.flowData.requestSampleData(
          flowId,
          resourceId,
          resourceType,
          'responseMappingExtract'
        )
      );
    }
  }, [dispatch, extractFields, flowId, resourceId, resourceType]);

  const defaultExtractFields = mappingUtil.getResponseMappingDefaultExtracts(
    resourceType
  );
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
    dispatch(actions.resource.commitStaged('flows', flowId, 'value'));

    if (closeModal) {
      onClose();
    }
  };

  let formattedExtractFields = defaultExtractFields;

  if (extractFields) {
    const extractPaths = getJSONPaths(extractFields);

    formattedExtractFields =
      (extractPaths &&
        extractPaths.map(obj => ({ name: obj.id, id: obj.id }))) ||
      [];
  }

  return (
    <ModalDialog onClose={onClose} show minWidth="md" maxWidth="md">
      <div>Define Response Mapping</div>
      <div className={classes.container}>
        <div className={classes.root}>
          <div className={classes.header}>
            <Typography
              variant="subtitle2"
              className={classes.childHeader}
              key="heading_extract">
              {resourceType === 'imports' ? 'Import' : 'Lookup'} Response Field
            </Typography>

            <Typography
              variant="subtitle2"
              className={classes.childHeader}
              key="heading_generate">
              Source Record Field (New/Existing Field)
            </Typography>
          </div>
          <div key={changeIdentifier}>
            {tableData.map(r => (
              <div className={classes.rowContainer} key={r.index}>
                <div className={classes.innerRow}>
                  <div className={classes.childHeader}>
                    <DynaTypeableSelect
                      id={`extract-${r.index}`}
                      disabled={disabled}
                      labelName="name"
                      valueName="id"
                      value={r[keyName]}
                      options={formattedExtractFields || []}
                      onBlur={(id, evt) => {
                        handleFieldUpdate(
                          r.index,
                          { target: { value: evt } },
                          keyName
                        );
                      }}
                    />
                  </div>
                  <div className={classes.childHeader}>
                    <DynaTypeableSelect
                      id={`generate-${r.index}`}
                      disabled={disabled}
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
                  </div>
                  <div>
                    <ActionButton
                      disabled={disabled}
                      data-test={`delete-${r.index}`}
                      aria-label="delete"
                      onClick={() => {
                        handleDelete(r.index);
                      }}>
                      <TrashIcon />
                    </ActionButton>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div>
        <ButtonGroup>
          <Button
            disabled={disabled}
            data-test="saveMapping"
            onClick={() => handleSubmit(false)}
            variant="outlined"
            color="secondary">
            Save
          </Button>
          <Button
            disabled={disabled}
            data-test="saveAndCloseMapping"
            onClick={() => handleSubmit(true)}
            variant="outlined"
            color="primary">
            Save and close
          </Button>
        </ButtonGroup>
      </div>
    </ModalDialog>
  );
}
