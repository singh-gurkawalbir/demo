import { Drawer, makeStyles, Typography } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import React, { useCallback } from 'react';
import {
  useRouteMatch,
  useHistory,
  Route,
  useLocation,
  Switch,
} from 'react-router-dom';
import { selectors } from '../../../../../../../reducers';
import PanelHeader from '../../../../../../../components/PanelHeader';
import LoadResources from '../../../../../../../components/LoadResources';
import ApplicationImg from '../../../../../../../components/icons/ApplicationImg';
import DrawerTitleBar from '../TitleBar';
import VariationAttributesList from './AttributesList';
import VariationMappings from './MappingsWrapper';
import actions from '../../../../../../../actions';
import Spinner from '../../../../../../../components/Spinner';
import { capitalizeFirstLetter } from '../../../../../../../utils/string';
import FilledButton from '../../../../../../../components/Buttons/FilledButton';
import TextButton from '../../../../../../../components/Buttons/TextButton';
import ActionGroup from '../../../../../../../components/ActionGroup';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    // marginTop: theme.appBarHeight,
    width: '60%',
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    backgroundColor: theme.palette.background.default,
    zIndex: theme.zIndex.drawer + 1,
    overflowX: 'hidden',
  },
  saveButtonGroup: {
    margin: '10px 10px 10px 24px',
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
  root: {
    backgroundColor: theme.palette.common.white,
    border: '1px solid',
    borderColor: theme.palette.secondary.lightest,
    minHeight: '100%',
  },
  subNav: {
    minWidth: '200px',
    width: '20%',
    background: theme.palette.background.paper2,
    paddingTop: theme.spacing(1),
  },
  content: {
    width: '100%',
    height: '100%',
    padding: theme.spacing(0, 3, 3, 0),
  },
  header: {
    // background: theme.palette.primary.main,
  },
  variationMapWrapper: {
    display: 'flex',
  },
  mappingWrapper: {
    marginLeft: 20,
    marginTop: theme.spacing(1),
  },
}));

export const variationUrlName = (variation = '') => variation.replace(/\//g, '__');

function VariationMappingDrawer({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const { flowId, subCategoryId, variation: variationParamName, categoryId, depth } = match.params;
  const variation = variationParamName?.replace(/__/g, '/');
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const uiAssistant = useSelector(state => {
    const categoryMappingMetadata =
      selectors.categoryMapping(state, integrationId, flowId) || {};
    const { uiAssistant = '' } = categoryMappingMetadata;

    return capitalizeFirstLetter(uiAssistant);
  });
  const metadataLoaded = useSelector(
    state => !!selectors.categoryMapping(state, integrationId, flowId)
  );
  const isVariationAttributes = useSelector(state => {
    // eslint-disable-next-line camelcase
    const { variation_attributes = [] } =
      selectors.categoryMappingGenerateFields(state, integrationId, flowId, {
        sectionId: subCategoryId,
        depth,
      }) || {};

    return !!variation_attributes.length;
  });
  const firstVariation =
    useSelector(state => {
      // property being read as is from IA metadata, to facilitate initialization and to avoid re-adjust while sending back.
      // eslint-disable-next-line camelcase
      const { variation_themes = [] } =
        selectors.categoryMappingGenerateFields(state, integrationId, flowId, {
          sectionId: subCategoryId,
          depth,
        }) || {};
      const variation = variation_themes.find(
        theme => theme.id === 'variation_theme'
      );

      return (
        // eslint-disable-next-line camelcase
        variationUrlName(variation?.variation_attributes?.[0])
      );
    }) || {};

  const handleClose = useCallback(() => {
    history.push(parentUrl);
  }, [history, parentUrl]);
  const handleCancel = useCallback(() => {
    dispatch(
      actions.integrationApp.settings.categoryMappings.cancelVariationMappings(
        integrationId,
        flowId,
        `${flowId}-${subCategoryId}-${depth}-${
          isVariationAttributes ? 'variationAttributes' : variation
        }`
      )
    );
    handleClose();
  }, [
    dispatch,
    flowId,
    depth,
    handleClose,
    integrationId,
    isVariationAttributes,
    subCategoryId,
    variation,
  ]);
  const handleSave = useCallback(() => {
    dispatch(
      actions.integrationApp.settings.categoryMappings.saveVariationMappings(
        integrationId,
        flowId,
        `${flowId}-${subCategoryId}-${depth}-${
          isVariationAttributes ? 'variationAttributes' : variation
        }`,
        { categoryId, subCategoryId, isVariationAttributes, depth }
      )
    );
    handleClose();
  }, [
    categoryId,
    dispatch,
    flowId,
    depth,
    handleClose,
    integrationId,
    isVariationAttributes,
    subCategoryId,
    variation,
  ]);

  if (!variation && !isVariationAttributes) {
    history.push(`${match.url}/${firstVariation}`);

    return null;
  }

  return (
    <>
      <Drawer
        anchor="right"
        open={!!match}
        BackdropProps={{ invisible: true }}
        classes={{
          paper: classes.drawerPaper,
        }}
        onClose={handleClose}>
        <DrawerTitleBar
          title={`Configure ${uiAssistant} variation themes: ${uiAssistant} - NetSuite`}
          flowId={flowId}
          addCategory
          backToParent
          onClose={handleClose}
        />
        {metadataLoaded ? (
          <div className={classes.root}>
            <div className={classes.variationMapWrapper}>
              {!isVariationAttributes && (
                <div className={classes.subNav}>
                  <VariationAttributesList
                    integrationId={integrationId}
                    flowId={flowId}
                    categoryId={subCategoryId}
                    depth={depth}
                  />
                </div>
              )}
              <div className={classes.content}>
                <PanelHeader
                  className={classes.header}
                  title="Map variant attributes"
                />
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
                <div className={classes.mappingWrapper}>
                  <VariationMappings
                    integrationId={integrationId}
                    flowId={flowId}
                    categoryId={categoryId}
                    sectionId={subCategoryId}
                    variation={variation}
                    depth={depth}
                    isVariationAttributes={isVariationAttributes}
                  />
                </div>
                <ActionGroup className={classes.saveButtonGroup}>
                  <FilledButton
                    id={flowId}
                    data-test="saveImportMapping"
                    onClick={handleSave}>
                    Save
                  </FilledButton>
                  <TextButton
                    data-test="saveImportMapping"
                    onClick={handleCancel}>
                    Close
                  </TextButton>
                </ActionGroup>
              </div>
            </div>
          </div>
        ) : (
          <Spinner centerAll />
        )}
      </Drawer>
    </>
  );
}

export default function VariationMappingDrawerRoute(props) {
  const match = useRouteMatch();
  const location = useLocation();

  return (
    <LoadResources required resources="flows,exports,imports,connections">
      <Switch>
        <Route
          exact
          path={[
            `${match.url}/:flowId/utilitymapping/:categoryId/depth/:depth/variationAttributes/:subCategoryId`,
          ]}>
          <VariationMappingDrawer
            {...props}
            parentUrl={location.pathname.replace(
              /\/variationAttributes\/.*$/,
              ''
            )}
          />
        </Route>
        <Route
          exact
          path={[
            `${match.url}/:flowId/utilitymapping/:categoryId/depth/:depth/variations/:subCategoryId`,
            `${match.url}/:flowId/utilitymapping/:categoryId/depth/:depth/variations/:subCategoryId/:variation`,
          ]}>
          <VariationMappingDrawer
            {...props}
            parentUrl={location.pathname.replace(/\/depth\/.*$/, '')}
          />
        </Route>
      </Switch>
    </LoadResources>
  );
}
