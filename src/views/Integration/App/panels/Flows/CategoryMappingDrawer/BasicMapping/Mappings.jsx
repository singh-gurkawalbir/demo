import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import clsx from 'clsx';
import { FixedSizeList } from 'react-window';
import { InputAdornment, TextField, Autocomplete } from '@mui/material';
import ListIcon from '@mui/icons-material/List';
import { Spinner } from '@celigo/fuse-ui';
import { generateId } from '../../../../../../../utils/string';
import { selectors } from '../../../../../../../reducers';
import actions from '../../../../../../../actions';
import ActionButton from '../../../../../../../components/ActionButton';
import MappingSettings from '../../../../../../../components/Mapping/Settings/SettingsButton';
import TrashIcon from '../../../../../../../components/icons/TrashIcon';
import PreferredIcon from '../../../../../../../components/icons/PreferredIcon';
import ConditionalIcon from '../../../../../../../components/icons/ConditionalIcon';
import OptionalIcon from '../../../../../../../components/icons/OptionalIcon';
import RequiredIcon from '../../../../../../../components/icons/RequiredIcon';
import MappingConnectorIcon from '../../../../../../../components/icons/MappingConnectorIcon';
import Help from '../../../../../../../components/Help';
import useSelectorMemo from '../../../../../../../hooks/selectors/useSelectorMemo';

// TODO Azhar style header
const useStyles = makeStyles(theme => ({
  root: {
    overflowY: 'off',
  },
  rowContainer: {
    display: 'block',
    padding: '0px',
  },
  childHeader: {
    '& > div': {
      width: '100%',
    },
  },
  innerRow: {
    display: 'flex',
    width: '100%',
    marginBottom: theme.spacing(1),
  },
  mappingsBody: {
    height: 'calc(100% - 32px)',
    overflow: 'visible',
  },
  disableChildRow: {
    cursor: 'not-allowed',
    // TODO: (Aditya) Temp fix. To be removed on changing Import Mapping as Dyna Form
    '& > div > div > div': {
      background: theme.palette.secondary.lightest,
    },
  },
  lockIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
  },

  filterTypeIcon: {
    width: 9,
    height: 9,
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  PreferredIcon: {
    color: theme.palette.warning.main,
  },
  OptionalIcon: {
    color: theme.palette.secondary.lightest,
  },
  ConditionalIcon: {
    color: theme.palette.primary.main,
  },
  RequiredIcon: {
    color: theme.palette.error.main,
  },
  mappingIcon: {
    color: theme.palette.secondary.lightest,
    fontSize: 38,
  },
  mapField: {
    display: 'flex',
    position: 'relative',
    width: '40%',
  },
  dynaTextContainer: {
    padding: 0,
    display: 'flex',
    '& > .MuiFilledInput-multiline': {
      minHeight: '48px',
      padding: theme.spacing(1),
      '& >:nth-child(1)': {
        margin: 0,
        minWidth: 0,
      },
      '& >:nth-child(2)': {
        minHeight: '16px !important',
        wordBreak: 'break-word',
      },
    },
  },
  mappingActionsCategory: {
    marginTop: theme.spacing(1),
    display: 'flex',
  },
  fieldFilterIcon: {
    marginRight: 0,
  },
  paper: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
}));

const FieldHelp = ({id, name, description = 'No Description available.' }) => (
  <Help
    title={name}
    helpKey={`categoryMappings-${id}`}
    helpText={description}
    size="medium"
    sx={{
      ml: 0.5,
      '& svg': {
        mt: -0.5,
      },
    }}
    />
);

const MappingRow = ({
  mapping,
  integrationId,
  flowId,
  editorId,
  disabled,
  extractFields,
  generateFields,
  depth,
  sectionId,
  options = {},
}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const {
    extract,
    generate,
    name,
    description,
    isRequired,
    key: mappingKey,
    hardCodedValue,
  } = mapping;
  const extractValue = extract || (hardCodedValue ? `"${hardCodedValue}"` : undefined);
  const generateLabel = generateFields.find(f => f.id === generate)?.name || generate;

  const handleBlur = useCallback((field, value) => {
    // check if value changes or user entered something in new row
    if ((!mappingKey && value) || (mappingKey && mapping[field] !== value)) {
      if (mappingKey && value === '') {
        if (
          (field === 'extract' && !generate) ||
            (field === 'generate' &&
              !extract &&
              !('hardCodedValue' in mapping))
        ) {
          dispatch(actions.integrationApp.settings.categoryMappings.delete(integrationId, flowId, editorId, mappingKey));

          return;
        }
      }
      dispatch(actions.integrationApp.settings.categoryMappings.patchField(integrationId, flowId, editorId, field, mappingKey, value));
    }
  },
  [dispatch, editorId, extract, flowId, generate, integrationId, mapping, mappingKey]
  );

  const handleExtractBlur = useCallback(e => {
    let extract = e.target.value;

    const field = extractFields.find(field => field.name === extract);

    if (field) {
      extract = field.id;
    }

    handleBlur('extract', extract);
  }, [extractFields, handleBlur]);

  const handleGenerateBlur = useCallback((_id, value) => {
    let generate = value;

    if (value?.id) {
      generate = value.id;
    } else if (typeof value === 'string') {
      const field = generateFields.find(field => field.name === value);

      if (field) {
        generate = field.id;
      }
    }
    handleBlur('generate', generate);
  }, [generateFields, handleBlur]);

  const handleDeleteClick = useCallback(() => {
    dispatch(actions.integrationApp.settings.categoryMappings.delete(integrationId, flowId, editorId, mappingKey));
  }, [dispatch, editorId, flowId, integrationId, mappingKey]);

  const Option = (props, {filterType, name = ''}) => (
    <li {...props}>
      <Icon filterType={filterType} />
      {name}
    </li>
  );

  const Icon = ({ filterType }) => {
    switch (filterType) {
      case 'preferred':
        return (
          <PreferredIcon
            className={clsx(
              classes.filterTypeIcon,
              classes.PreferredIcon
            )}
          />
        );
      case 'optional':
        return (
          <OptionalIcon
            className={clsx(classes.filterTypeIcon, classes.OptionalIcon)}
          />
        );
      case 'conditional':
        return (
          <ConditionalIcon
            className={clsx(
              classes.filterTypeIcon,
              classes.ConditionalIcon
            )}
          />
        );
      case 'required':
        return (
          <RequiredIcon
            className={clsx(classes.filterTypeIcon, classes.RequiredIcon)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={classes.rowContainer}>
      <div className={classes.innerRow}>
        <div
          className={clsx(classes.childHeader, classes.mapField, {
            [classes.disableChildRow]: isRequired || disabled,
          })}>
          <Autocomplete
            id={`fieldMappingGenerate-${mappingKey}`}
            options={generateFields}
            value={generate}
            disableClearable
            disabled={disabled}
            freeSolo
            noOptionsText=""
            size="small"
            onChange={handleGenerateBlur}
            classes={{paper: classes.paper}}
            renderOption={Option}
            getOptionLabel={option => option.name || generateFields.find(f => f.id === option)?.name || ''}
            renderInput={params => (
              <TextField
                className={classes.dynaTextContainer}
                {...params}
                value={generateLabel}
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start" className={classes.fieldFilterIcon}>
                      <Icon filterType={mapping.filterType || generateFields.find(f => f.id === mapping.generate)?.filterType} />
                    </InputAdornment>
                  ),
                }}
               />
            )}
          />
        </div>
        <MappingConnectorIcon className={classes.mappingIcon} />
        <div
          key={extractValue}
          className={clsx(classes.childHeader, classes.mapField, {
            [classes.disableChildRow]:
            mapping.isNotEditable || disabled,
          })}>
          <Autocomplete
            id={`fieldMappingExtract-${mapping.key}`}
            options={extractFields}
            defaultValue={extractValue}
            disableClearable
            freeSolo
            forcePopupIcon={false}
            noOptionsText=""
            classes={{paper: classes.paper}}
            size="small"
            disabled={disabled}
            onBlur={handleExtractBlur}
            getOptionLabel={option => option.name || extractFields.find(f => f.id === option)?.name || option || ''}
            renderInput={params => (
              <TextField
                className={classes.dynaTextContainer}
                {...params}
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      {mapping.showListOption ? <ListIcon /> : null }
                    </InputAdornment>
                  ),
                }}
               />
            )}
          />

        </div>
        <div className={classes.mappingActionsCategory}>
          <div>
            <MappingSettings
              dataTest={`fieldMappingSettings-${mapping.key}`}
              isCategoryMapping
              disabled={mapping.isNotEditable || disabled}
              mappingKey={mapping.key}
              integrationId={integrationId}
              flowId={flowId}
              depth={depth}
              sectionId={sectionId}
              editorId={editorId}
              {...options}
          />
          </div>
          <div key="delete_button">
            <ActionButton
              data-test={`fieldMappingRemove-${mapping.key}`}
              aria-label="delete"
              disabled={
              mapping.isNotEditable || disabled
            }
              onClick={handleDeleteClick}>
              <TrashIcon />
            </ActionButton>
          </div>
          <div>
            <FieldHelp
              id={generate}
              name={name}
              description={description}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Row = ({index, isScrolling, style, data}) => {
  const {
    integrationId,
    flowId,
    editorId,
    sectionId,
    depth,
    extractFields,
    generateFields,
    tableData,
    disabled,
    options,
  } = data;

  return (
    <div key={tableData[index].key} style={style} >
      {isScrolling ? <Spinner />
        : (
          <MappingRow
            mapping={tableData[index]}
            integrationId={integrationId}
            flowId={flowId}
            editorId={editorId}
            sectionId={sectionId}
            depth={depth}
            extractFields={extractFields}
            generateFields={generateFields}
            disabled={disabled}
            options={options} />
        )}
    </div>
  );
};

function areEqual(prevProps, nextProps) {
  const {
    isScrolling: prevIsScrolling,
    ...prevRest
  } = prevProps;
  const {
    isScrolling: nextIsScrolling,
    ...nextRest
  } = nextProps;

  const prev = prevRest.data?.tableData?.[prevRest.index];
  const next = nextRest.data?.tableData?.[nextRest.index];

  return (
    prevRest?.data?.disabled === nextRest?.data?.disabled &&
    prev?.generate === next?.generate &&
    prev?.extract === next?.extract &&
    prev?.hardCodedValue === next?.hardCodedValue &&
    (nextIsScrolling === prevIsScrolling || nextIsScrolling)
  );
}
const MemoizedRow = React.memo(Row, areEqual);

export default function ImportMapping(props) {
  // generateFields and extractFields are passed as an array of field names
  const {
    editorId,
    integrationId,
    flowId,
    generateFields = [],
    sectionId,
    options = {},
    depth,
  } = props;
  const classes = useStyles();
  const memoizedOptions = useMemo(() => ({ sectionId, depth }), [sectionId, depth]);
  const { deleted: disabled = false } = useSelectorMemo(selectors.mkMappingsForCategory, integrationId, flowId, memoizedOptions) || {};
  const { attributes = {}, mappingFilter = 'mapped' } = useSelectorMemo(selectors.mkCategoryMappingFilters, integrationId, flowId) || {};
  const { mappings } = useSelectorMemo(selectors.mkCategoryMappingsForSection, integrationId, flowId, editorId, depth);
  const extractFields = useSelectorMemo(selectors.mkCategoryMappingsExtractsMetadata, integrationId, flowId);

  const tableData = useMemo(() => {
    const visibleAttributes = Object.keys(attributes).filter(key => attributes[key]);
    const mappingsCopy = (mappings || [])
      .filter(field => {
        let visible = visibleAttributes.includes(field.filterType) || !field.filterType;

        if (mappingFilter === 'mapped') {
          visible = visible && (!!field.extract || !!field.hardCodedValue) && !!field.generate;
        } else if (mappingFilter === 'unmapped') {
          visible = visible && !field.extract && !field.hardCodedValue;
        }

        return visible;
      });

    mappingsCopy.push({key: generateId()});

    return mappingsCopy;
  }, [mappings, attributes, mappingFilter]);

  const itemData = useMemo(() => (
    {
      integrationId,
      flowId,
      editorId,
      sectionId,
      depth,
      extractFields,
      generateFields,
      tableData,
      disabled,
      options,
    }
  ), [
    integrationId,
    flowId,
    editorId,
    sectionId,
    disabled,
    depth,
    extractFields,
    generateFields,
    tableData,
    options,
  ]);

  return (
    <div
      className={classes.root}>
      <div className={classes.mappingsBody}>

        <FixedSizeList
          useIsScrolling
          itemSize={60}
          height={380}
          itemCount={tableData.length}
          itemData={itemData}
          overscanCount={3}
        >
          {MemoizedRow}
        </FixedSizeList>
      </div>
    </div>
  );
}
