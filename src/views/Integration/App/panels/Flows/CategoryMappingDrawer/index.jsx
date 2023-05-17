import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import {
  useRouteMatch,
  useHistory,
  generatePath,
  useParams,
} from 'react-router-dom';
import makeStyles from '@mui/styles/makeStyles';
import {
  Tooltip,
  IconButton,
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from '@mui/material';
import { Spinner, TextButton } from '@celigo/fuse-ui';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import LoadResources from '../../../../../../components/LoadResources';
import Loader from '../../../../../../components/Loader';
import PanelHeader from '../../../../../../components/PanelHeader';
import TrashIcon from '../../../../../../components/icons/TrashIcon';
import RestoreIcon from '../../../../../../components/icons/RestoreIcon';
import ApplicationImg from '../../../../../../components/icons/ApplicationImg';
import ArrowUpIcon from '../../../../../../components/icons/ArrowUpIcon';
import ArrowDownIcon from '../../../../../../components/icons/ArrowDownIcon';
import ShowContentIcon from '../../../../../../components/icons/ShowContentIcon';
import HideContentIcon from '../../../../../../components/icons/HideContentIcon';
import VariationIcon from '../../../../../../components/icons/ConfigureSettingIcon';
import Mappings from './BasicMapping';
import Filters from './Filters';
import CategoryList from './CategoryList';
import CategoryMappingActions from './CategoryMappingActions';
import CollapseWindowIcon from '../../../../../../components/icons/CollapseWindowIcon';
import ExpandWindowIcon from '../../../../../../components/icons/ExpandWindowIcon';
import useSelectorMemo from '../../../../../../hooks/selectors/useSelectorMemo';
import SettingsDrawer from '../../../../../../components/Mapping/Settings';
import { capitalizeFirstLetter, getTrimmedTitle } from '../../../../../../utils/string';
import SaveAndCloseButtonGroupAuto from '../../../../../../components/SaveAndCloseButtonGroup/SaveAndCloseButtonGroupAuto';
import { getFormStatusFromCategoryMappingStatus } from '../../../../../../utils/integrationApps';
import { useFormOnCancel } from '../../../../../../components/FormOnCancelContext';
import { CATEGORY_MAPPING_SAVE_STATUS, CATEGORY_MAPPING_ASYNC_KEY } from '../../../../../../constants';
import RightDrawer from '../../../../../../components/drawer/Right';
import DrawerHeader from '../../../../../../components/drawer/Right/DrawerHeader';
import DrawerContent from '../../../../../../components/drawer/Right/DrawerContent';
import DrawerFooter from '../../../../../../components/drawer/Right/DrawerFooter';
import AddCategoryMappingDrawer from './AddCategory';
import VariationMappingDrawer from './VariationMapping';
import { buildDrawerUrl, drawerPaths } from '../../../../../../utils/rightDrawer';

const emptySet = [];
const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: '60%',
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: '-4px 4px 8px rgba(0,0,0,0.15)',
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
    overflowX: 'hidden',
  },
  mappingContainer: {
    padding: '0 0 10px 20px',
    border: 'solid 1px',
    borderColor: theme.palette.background.default,
    marginTop: theme.spacing(1),
    background: theme.palette.background.paper,
  },
  saveButtonGroup: {
    margin: '10px 10px 10px 24px',
  },
  fullWidth: {
    width: '100%',
    padding: 12,
  },
  mappingHeader: {
    padding: theme.spacing(1),
    marginLeft: '20px',
    background: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  mappingChild: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '40%',
    marginRight: 45,
  },
  // toolbar: theme.mixins.toolbar,
  root: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    height: '100%',
  },
  childExpansionPanel: {
    background: theme.palette.background.default,
    marginTop: 10,
    boxShadow: 'none',
  },
  secondaryHeading: {
    fontFamily: 'Roboto500',
    lineHeight: theme.spacing(3),
  },
  subNav: {
    width: '20%',
    minWidth: 200,
    background: theme.palette.background.paper2,
    paddingTop: theme.spacing(1),
  },
  deleteIcon: {
    position: 'absolute',
    right: '45px',
  },
  variationIcon: {
    position: 'absolute',
    right: theme.spacing(10),
  },
  content: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(0, 3, 3, 0),
  },
  header: {
    // background: theme.palette.primary.main,
  },
  default: {
    marginBottom: 10,
  },
  categoryMapWrapper: {
    display: 'flex',
    minHeight: '100%',
  },
  rootExpansionPanel: {
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
  },
  innerContentHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    display: 'flex',
  },
  categoryMappingExpPanelSummary: {
    padding: '0px 12px',
    width: '100%',
  },
}));

function CategoryMappings({
  integrationId,
  flowId,
  categoryId,
  sectionId,
  isRoot = true,
  depth = 0,
  isParentCommonCategory = false,
}) {
  const [requestedGenerateFields, setRequestedGenerateFields] = useState(false);
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch();
  const isCommonCategory =
    sectionId === 'commonAttributes' || isParentCommonCategory;
  const [expanded, setExpanded] = useState(isRoot);
  const categoryMemoizedOptions = useMemo(() => ({ sectionId: categoryId, depth: 0 }), [categoryId]);
  const memoizedOptions = useMemo(() => ({ sectionId, depth }), [depth, sectionId]);
  let generateFields;
  const {
    fields: sectionGenerateFields,
    name,
    variation_themes: variationThemes,
    variation_attributes: variationAttributes,
  } = useSelectorMemo(selectors.mkCategoryMappingGenerateFields, integrationId, flowId, memoizedOptions) || {};
  const {
    fields: categoryGenerateFields,
  } = useSelectorMemo(selectors.mkCategoryMappingGenerateFields, integrationId, flowId, categoryMemoizedOptions) || {};

  if (depth > 0) {
    generateFields = [...(categoryGenerateFields || []), ...(sectionGenerateFields || [])];
  } else {
    generateFields = sectionGenerateFields;
  }
  const { collapseAction } = useSelectorMemo(selectors.mkCategoryMappingsCollapsedStatus, integrationId, flowId) || {};
  const memoizedCategoryOptions = useMemo(() => ({sectionId, depth}), [sectionId, depth]);
  const { children = [], deleted } = useSelectorMemo(selectors.mkMappingsForCategory, integrationId, flowId, memoizedCategoryOptions) || {};
  const hasVariationMappings =
    (variationThemes && !!variationThemes.length) ||
    (variationAttributes && !!variationAttributes.length);

  useEffect(() => {
    setRequestedGenerateFields(false);
  }, [sectionId]);

  useEffect(() => {
    if (!generateFields && !requestedGenerateFields && isRoot) {
      dispatch(
        actions.integrationApp.settings.categoryMappings.requestMetadata(
          integrationId,
          flowId,
          sectionId,
          { generatesMetadata: true }
        )
      );
      setRequestedGenerateFields(true);
    }
  }, [
    generateFields,
    requestedGenerateFields,
    dispatch,
    integrationId,
    flowId,
    sectionId,
    isRoot,
  ]);

  const shouldExpand =
    isRoot || (collapseAction ? collapseAction !== 'collapse' : expanded);

  useEffect(() => {
    setExpanded(shouldExpand);
  }, [shouldExpand]);
  useEffect(() => {
    if (collapseAction) {
      dispatch(
        actions.integrationApp.settings.categoryMappings.clearCollapseStatus(
          integrationId,
          flowId
        )
      );
    }
  }, [collapseAction, dispatch, flowId, integrationId]);
  const handleChange = useCallback(() => {
    setExpanded(!expanded);
  }, [expanded]);
  const handleDelete = useCallback(e => {
    // Clicking of this icon should avoid collapsing this category section
    e.stopPropagation();
    dispatch(
      actions.integrationApp.settings.categoryMappings.deleteCategory(
        integrationId,
        flowId,
        sectionId,
        depth
      )
    );
  }, [dispatch, flowId, integrationId, sectionId, depth]);

  const handleRestore = useCallback(e => {
    // Clicking of this icon should avoid collapsing this category section
    e.stopPropagation();
    dispatch(
      actions.integrationApp.settings.categoryMappings.restoreCategory(
        integrationId,
        flowId,
        sectionId,
        depth
      )
    );
  }, [dispatch, flowId, integrationId, sectionId, depth]);

  const handleVariation = useCallback(e => {
    // Clicking of this icon should avoid collapsing this category section
    e.stopPropagation();
    history.push(buildDrawerUrl({
      path: drawerPaths.MAPPINGS.CATEGORY_MAPPING.VARIATION_MAPPING.ROOT,
      baseUrl: match.url,
      params: { depth, subCategoryId: sectionId },
    }));
  }, [history, match.url, sectionId, depth]);

  if (!generateFields) {
    return (
      <Loader open hideBackDrop>
        Loading
        <Spinner />
      </Loader>
    );
  }

  return (
    <div className={isRoot ? classes.mappingContainer : classes.default}>
      <Accordion
        expanded={expanded}
        elevation={0}
        onChange={handleChange}
        className={
          isRoot ? classes.rootExpansionPanel : classes.childExpansionPanel
        }>
        <AccordionSummary
          aria-controls="panel1bh-content"
          className={classes.categoryMappingExpPanelSummary}
          id="panel1bh-header">
          <div className={classes.innerContentHeader}>
            <div className={classes.title}>
              <span>{expanded ? <ArrowUpIcon /> : <ArrowDownIcon />}</span>
              <Typography className={classes.secondaryHeading} variant="body2">
                {name}
              </Typography>
            </div>
            <span>
              {expanded ? (
                <Tooltip title="Hide categories" placement="bottom">
                  <IconButton size="small" color="inherit">
                    <ShowContentIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Enable categories" placement="bottom">
                  <IconButton size="small" color="inherit">
                    <HideContentIcon />
                  </IconButton>
                </Tooltip>
              )}
            </span>
          </div>

          {hasVariationMappings && (
            <Tooltip title="Configure variations" placement="bottom">
              <IconButton
                onClick={handleVariation}
                size="small"
                color="inherit"
                className={classes.variationIcon}>
                <VariationIcon />
              </IconButton>
            </Tooltip>
          )}
          {!isCommonCategory && (
            <div>
              {deleted ? (
                <Tooltip title="Restore category" placement="bottom">
                  <IconButton
                    onClick={handleRestore}
                    size="small"
                    color="inherit"
                    className={classes.deleteIcon}>
                    <RestoreIcon />
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip title="Delete category" placement="bottom">
                  <IconButton
                    onClick={handleDelete}
                    size="small"
                    color="inherit"
                    className={classes.deleteIcon}>
                    <TrashIcon />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <div className={classes.fullWidth}>
            <Mappings
              id={`${flowId}-${sectionId}-${depth}`}
              flowId={flowId}
              depth={depth}
              integrationId={integrationId}
              sectionId={sectionId}
              generateFields={generateFields || emptySet}
            />
            {children.length > 0 &&
              children.map(child => (
                <CategoryMappings
                  categoryId={categoryId}
                  integrationId={integrationId}
                  flowId={flowId}
                  key={child.id}
                  isRoot={false}
                  depth={depth + 1}
                  isParentCommonCategory={isCommonCategory}
                  generateFields={generateFields || emptySet}
                  sectionId={child.id}
                />
              ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}

function CategoryMappingContent({ integrationId }) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { flowId, categoryId } = useParams();

  const metadataLoaded = useSelector(
    state => !!selectors.categoryMapping(state, integrationId, flowId)
  );
  const { collapseStatus = 'collapsed' } = useSelectorMemo(selectors.mkCategoryMappingsCollapsedStatus, integrationId, flowId) || {};
  const uiAssistant = useSelector(state => {
    const categoryMappingMetadata =
      selectors.categoryMapping(state, integrationId, flowId) || {};
    const { uiAssistant = '' } = categoryMappingMetadata;

    return capitalizeFirstLetter(uiAssistant);
  });
  const mappedCategories = useSelectorMemo(selectors.mkMappedCategories, integrationId, flowId) || [];
  const currentSectionLabel =
  (mappedCategories.find(category => category.id === categoryId) || {})
    .name || categoryId;

  const handleCollapseAll = useCallback(() => {
    dispatch(
      actions.integrationApp.settings.categoryMappings.collapseAll(
        integrationId,
        flowId
      )
    );
  }, [dispatch, flowId, integrationId]);
  const handleExpandAll = useCallback(() => {
    dispatch(
      actions.integrationApp.settings.categoryMappings.expandAll(
        integrationId,
        flowId
      )
    );
  }, [dispatch, flowId, integrationId]);

  if (!metadataLoaded) {
    return (
      <Loader open hideBackDrop>
        Loading
        <Spinner />
      </Loader>
    );
  }

  return (
    <div className={classes.root}>
      <div className={classes.categoryMapWrapper}>
        <div className={classes.subNav}>
          <CategoryList integrationId={integrationId} flowId={flowId} />
        </div>
        <div className={classes.content}>
          <PanelHeader className={classes.header} title={currentSectionLabel}>
            <Filters integrationId={integrationId} flowId={flowId} uiAssistant={uiAssistant} />
            {collapseStatus === 'collapsed' ? (
              <TextButton
                startIcon={<ExpandWindowIcon />}
                onClick={handleExpandAll}
                sx={{mr: '-30px'}}>
                Expand All
              </TextButton>
            ) : (
              <TextButton
                startIcon={<CollapseWindowIcon />}
                onClick={handleCollapseAll}
                sx={{mr: '-30px'}}>
                Collapse All
              </TextButton>
            )}
          </PanelHeader>
          <div className={classes.mappingHeader}>
            <div className={classes.mappingChild}>
              <Typography variant="h5" className={classes.childHeader}>
                {uiAssistant}
              </Typography>
              <ApplicationImg
                assistant={uiAssistant.toLowerCase()}
                size="small"
              />
            </div>
            <div className={classes.mappingChild}>
              <Typography variant="h5" className={classes.childHeader}>
                NetSuite
              </Typography>
              <ApplicationImg assistant="netsuite" />
            </div>
          </div>
          <CategoryMappings integrationId={integrationId} flowId={flowId} sectionId={categoryId} categoryId={categoryId} />
        </div>
      </div>
    </div>
  );
}

function CategoryMappingDrawer({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const { flowId, categoryId } = match.params;
  const {setCancelTriggered} = useFormOnCancel(CATEGORY_MAPPING_ASYNC_KEY);

  const flowName = useSelector(state => {
    const flow = selectors.resource(state, 'flows', flowId);

    return flow ? flow.name : flowId;
  });

  const mappingSaveStatus = useSelector(state =>
    selectors.categoryMappingSaveStatus(state, integrationId, flowId), shallowEqual
  );
  const disabled = mappingSaveStatus === CATEGORY_MAPPING_SAVE_STATUS.REQUESTED;
  const integrationName = useSelector(state => {
    const integration = selectors.resource(
      state,
      'integrations',
      integrationId
    );

    return integration ? integration.name : null;
  });

  const importId = useSelector(state => {
    const flow = selectors.resource(state, 'flows', flowId);

    if (flow) {
      const firstPP = flow.pageProcessors.find(
        pp => pp.type === 'import'
      );

      return firstPP ? firstPP._importId : null;
    }

    return null;
  });

  if (!integrationName) {
    return <LoadResources required resources="integrations" />;
  }

  return (
    <>
      <InitializationComp
        integrationId={integrationId}
        flowId={flowId}
        categoryId={categoryId}
        parentUrl={parentUrl}
        />
      <DrawerHeader
        hideBackButton
        title={`Edit mappings: ${getTrimmedTitle(flowName)}`}
        handleClose={setCancelTriggered}
        disableClose={disabled}
        closeDataTest="closeCategoryMapping">
        <CategoryMappingActions />
      </DrawerHeader>
      <DrawerContent>
        <CategoryMappingContent integrationId={integrationId} parentUrl={parentUrl} />
        <AddCategoryMappingDrawer integrationId={integrationId} flowId={flowId} />
        <VariationMappingDrawer
          integrationId={integrationId}
          flowId={flowId}
          categoryId={categoryId}
      />
      </DrawerContent>
      <DrawerFooter>
        <CategoryMappingFooter flowId={flowId} integrationId={integrationId} parentUrl={parentUrl} />
      </DrawerFooter>
      <SettingsDrawer
        integrationId={integrationId}
        flowId={flowId}
        importId={importId}
      />
    </>
  );
}

const InitializationComp = ({integrationId, flowId, categoryId, parentUrl}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const metadataLoaded = useSelector(
    state => !!selectors.categoryMapping(state, integrationId, flowId)
  );

  const mappingSaveStatus = useSelector(state =>
    selectors.categoryMappingSaveStatus(state, integrationId, flowId)
  );
  const mappedCategories = useSelectorMemo(selectors.mkMappedCategories, integrationId, flowId) || [];
  const isCurrentCategoryDeleted = useSelector(state => {
    const categoryMappingMetadata =
      selectors.categoryMapping(state, integrationId, flowId) || {};
    const { deleted = [] } = categoryMappingMetadata;

    return deleted?.[0]?.includes?.(categoryId);
  });

  useEffect(() => {
    if (!metadataLoaded) {
      dispatch(
        actions.integrationApp.settings.categoryMappings.requestMetadata(
          integrationId,
          flowId,
          categoryId
        )
      );
    }
  }, [
    dispatch,
    flowId,
    integrationId,
    metadataLoaded,
    categoryId,
  ]);
  useEffect(() => {
    const invalidCategory = !mappedCategories.find(c => c.id === categoryId);

    if (metadataLoaded && invalidCategory) {
      history.push(
        generatePath(match.path, {
          ...match.params,
          categoryId: 'commonAttributes',
        })
      );
    }
  }, [
    categoryId,
    flowId,
    history,
    mappedCategories,
    match.params,
    match.path,
    metadataLoaded,
  ]);

  useEffect(() => {
    if (mappingSaveStatus === 'close') {
      history.push(parentUrl);
      dispatch(
        actions.integrationApp.settings.categoryMappings.clear(
          integrationId,
          flowId
        )
      );
    } else if (mappingSaveStatus === 'saved' && isCurrentCategoryDeleted) {
      history.push(
        generatePath(match.path, {
          ...match.params,
          categoryId: 'commonAttributes',
        })
      );
      dispatch(
        actions.integrationApp.settings.categoryMappings.clearSaveStatus(
          integrationId,
          flowId
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, isCurrentCategoryDeleted, mappingSaveStatus, parentUrl]);

  return null;
};
const CategoryMappingFooter = ({flowId, integrationId, parentUrl}) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const mappingsChanged = useSelectorMemo(selectors.mkCategoryMappingsChanged, integrationId, flowId);
  const mappingSaveStatus = useSelector(state =>
    selectors.categoryMappingSaveStatus(state, integrationId, flowId)
  );
  const saveStatus = getFormStatusFromCategoryMappingStatus(mappingSaveStatus);

  const handleSave = useCallback(() => {
    dispatch(
      actions.integrationApp.settings.categoryMappings.save(
        integrationId,
        flowId
      )
    );
  }, [dispatch, flowId, integrationId]);
  const handleClose = useCallback(() => {
    history.push(parentUrl);
    dispatch(
      actions.integrationApp.settings.categoryMappings.clear(
        integrationId,
        flowId
      )
    );
  }, [dispatch, flowId, history, integrationId, parentUrl]);

  return (
    <SaveAndCloseButtonGroupAuto
      isDirty={mappingsChanged}
      status={saveStatus}
      onSave={handleSave}
      onClose={handleClose}
      shouldHandleCancel
      asyncKey={CATEGORY_MAPPING_ASYNC_KEY} />
  );
};
export default function CategoryMappingDrawerRoute({ integrationId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer
      path={drawerPaths.MAPPINGS.CATEGORY_MAPPING.ROOT}
      height="tall"
      width="large" >
      <LoadResources required integrationId={integrationId} resources="connections,exports,imports">
        <CategoryMappingDrawer integrationId={integrationId} parentUrl={match.url} />
      </LoadResources>
    </RightDrawer>
  );
}
