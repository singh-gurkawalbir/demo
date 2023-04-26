import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useSelector, useDispatch } from 'react-redux';
import React, { useCallback } from 'react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../../../../reducers';
import PanelHeader from '../../../../../../../components/PanelHeader';
import LoadResources from '../../../../../../../components/LoadResources';
import ApplicationImg from '../../../../../../../components/icons/ApplicationImg';
import VariationAttributesList from './AttributesList';
import VariationMappings from './MappingsWrapper';
import actions from '../../../../../../../actions';
import { capitalizeFirstLetter } from '../../../../../../../utils/string';
import FilledButton from '../../../../../../../components/Buttons/FilledButton';
import TextButton from '../../../../../../../components/Buttons/TextButton';
import RightDrawer from '../../../../../../../components/drawer/Right';
import DrawerHeader from '../../../../../../../components/drawer/Right/DrawerHeader';
import DrawerContent from '../../../../../../../components/drawer/Right/DrawerContent';
import DrawerFooter from '../../../../../../../components/drawer/Right/DrawerFooter';
import { drawerPaths } from '../../../../../../../utils/rightDrawer';

const useStyles = makeStyles(theme => ({
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
    backgroundColor: theme.palette.background.paper,
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
  variationMapWrapper: {
    display: 'flex',
  },
  mappingWrapper: {
    marginLeft: 20,
    marginTop: theme.spacing(1),
  },
}));

export const variationUrlName = (variation = '') => variation.replace(/\//g, '__');

function VariationMappingDrawer({ integrationId, flowId, categoryId, parentUrl }) {
  const match = useRouteMatch();
  const { subCategoryId, variation: variationParamName, depth } = match.params;
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

  if (!metadataLoaded) {
    return <Spinner center="screen" />;
  }

  return (
    <>
      <DrawerHeader
        title={`Configure ${uiAssistant} variation themes: ${uiAssistant} - NetSuite`}
        handleClose={handleClose}
        handleBack={handleClose}
        // Pass handleBack to move to the previous drawer, to land in the utility mapping drawer
        // as by default back button does go to the previous URL
        // and this drawer internally has URL re-directions for different variation attributes
      />
      <DrawerContent>
        <div className={classes.root}>
          <div className={classes.variationMapWrapper}>
            {!isVariationAttributes && (
            <div className={classes.subNav}>
              <VariationAttributesList
                integrationId={integrationId}
                flowId={flowId}
                categoryId={subCategoryId}
                depth={depth} />
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
                  isVariationAttributes={isVariationAttributes} />
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
      <DrawerFooter>
        <FilledButton
          id={flowId}
          data-test="saveVariationMapping"
          onClick={handleSave}>
          Save
        </FilledButton>
        <TextButton
          data-test="closeVariationMapping"
          onClick={handleCancel}>
          Close
        </TextButton>
      </DrawerFooter>
    </>
  );
}

export default function VariationMappingDrawerRoute({ integrationId, flowId, categoryId }) {
  const match = useRouteMatch();

  return (
    <LoadResources required integrationId={integrationId} resources="flows,connections,exports,imports">
      <RightDrawer
        path={[
          drawerPaths.MAPPINGS.CATEGORY_MAPPING.VARIATION_MAPPING.VARIATION,
          drawerPaths.MAPPINGS.CATEGORY_MAPPING.VARIATION_MAPPING.ROOT,
        ]}
        height="tall"
        width="large">
        <VariationMappingDrawer
          integrationId={integrationId}
          flowId={flowId}
          categoryId={categoryId}
          parentUrl={match.url}
          />
      </RightDrawer>
    </LoadResources>
  );
}
