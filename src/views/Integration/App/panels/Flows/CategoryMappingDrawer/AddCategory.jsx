import { Drawer, makeStyles, Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import React, { useCallback, useState } from 'react';
import {
  useRouteMatch,
  useHistory,
  Route,
  useLocation,
} from 'react-router-dom';
import * as selectors from '../../../../../../reducers';
import actions from '../../../../../../actions';
import DynaForm from '../../../../../../components/DynaForm';
import DynaSubmit from '../../../../../../components/DynaForm/DynaSubmit';
import LoadResources from '../../../../../../components/LoadResources';
import DrawerTitleBar from './TitleBar';
import Spinner from '../../../../../../components/Spinner';
import useEnqueueSnackbar from '../../../../../../hooks/enqueueSnackbar';
import SpinnerWrapper from '../../../../../../components/SpinnerWrapper';

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: '60%',
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    // boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    zIndex: theme.zIndex.drawer + 1,
  },
  form: {
    maxHeight: 'calc(100vh - 180px)',
    padding: theme.spacing(2, 3),
  },
  addCategoryDrawerForm: {
    padding: '16px 24px',
  },
  addCategoryDrawerFormActions: {
    margin: '0px 24px',
  },
}));

function AddCategoryMappingDrawer({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const { flowId } = match.params;
  const classes = useStyles();
  const dispatch = useDispatch();
  const [enqueueSnackbar] = useEnqueueSnackbar();
  const history = useHistory();
  const metadataLoaded = useSelector(
    state => !!selectors.categoryMapping(state, integrationId, flowId)
  );
  const categoryRelationshipData =
    useSelector(state =>
      selectors.categoryRelationshipData(state, integrationId, flowId)
    ) || [];
  const { uiAssistant = '' } =
    useSelector(state =>
      selectors.categoryMapping(state, integrationId, flowId)
    ) || {};
  const handleClose = useCallback(() => {
    history.push(parentUrl);
  }, [history, parentUrl]);
  const [formState, setFormState] = useState({
    showFormValidationsBeforeTouch: false,
  });
  const showCustomFormValidations = useCallback(() => {
    setFormState({
      showFormValidationsBeforeTouch: true,
    });
  }, []);
  const handleSave = useCallback(
    ({ category, childCategory, grandchildCategory }) => {
      dispatch(
        actions.integrationApp.settings.addCategory(integrationId, flowId, {
          category,
          childCategory,
          grandchildCategory,
        })
      );
      enqueueSnackbar({
        variant: 'success',
        message: `You have successfully added a new ${uiAssistant} category! Congratulations!`,
        persist: false,
      });
      handleClose();
    },
    [dispatch, enqueueSnackbar, flowId, handleClose, integrationId, uiAssistant]
  );
  const fieldMeta = {
    fieldMap: {
      category: {
        id: 'category',
        name: 'category',
        type: 'select',
        label: 'Choose Category',
        // Todo (Surya) 15333: helpText is needed
        helpText: 'Helptext is useful to give detailed information',
        required: true,
        defaultValue: '',
        options: [
          {
            items: categoryRelationshipData.map(item => ({
              label: item.name,
              value: item.id,
            })),
          },
        ],
      },
      childCategory: {
        id: 'childCategory',
        name: 'childCategory',
        type: 'select',
        // Todo (Surya) 15333: helpText is needed
        helpText: 'Helptext is useful to give detailed information',
        required: uiAssistant !== 'jet',
        defaultValue: '',
        label: 'Choose Sub-category',
        visible: false,
        refreshOptionsOnChangesTo: ['category'],
      },
      grandchildCategory: {
        id: 'grandchildCategory',
        name: 'grandchildCategory',
        type: 'select',
        // Todo (Surya) 15333: helpText is needed
        helpText: 'Helptext is useful to give detailed information',
        required: false,
        visible: false,
        label: 'Choose nested-category',
        refreshOptionsOnChangesTo: ['category', 'childCategory'],
      },
    },
    layout: {
      fields: ['category', 'childCategory', 'grandchildCategory'],
    },
    optionsHandler: (fieldId, fields) => {
      const category = fields.find(f => f.id === 'category').value;
      const childCategory = fields.find(f => f.id === 'childCategory');
      const grandchildCategory = fields.find(
        f => f.id === 'grandchildCategory'
      );

      if (fieldId === 'childCategory') {
        const categoryData = categoryRelationshipData.find(
          rel => rel.id === category
        );

        if (
          !categoryData ||
          !categoryData.children ||
          !categoryData.children.length
        ) {
          childCategory.visible = false;

          return [];
        }

        childCategory.visible = true;
        childCategory.value = undefined;

        return [
          {
            items: categoryData.children.map(item => ({
              label: item.name,
              value: item.id,
            })),
          },
        ];
      }

      if (fieldId === 'grandchildCategory') {
        const categoryData =
          categoryRelationshipData.find(rel => rel.id === category) || [];
        const childCategory = fields.find(
          field => field.id === 'childCategory'
        );

        if (
          !categoryData ||
          !categoryData.children ||
          !categoryData.children.length
        ) {
          return [];
        }

        const subcategoryData = categoryData.children.find(
          rel => rel.id === childCategory.value
        );

        if (
          !subcategoryData ||
          !subcategoryData.children ||
          !subcategoryData.children.length
        ) {
          grandchildCategory.visible = false;

          return [];
        }

        grandchildCategory.visible = true;
        grandchildCategory.value = undefined;

        return [
          {
            items: subcategoryData.children.map(item => ({
              label: item.name,
              value: item.id,
            })),
          },
        ];
      }

      return null;
    },
  };

  return (
    <Drawer
      anchor="right"
      classes={{
        paper: classes.drawerPaper,
      }}
      BackdropProps={{ invisible: true }}
      open={!!match}>
      <DrawerTitleBar
        flowId={flowId}
        addCategory
        onClose={handleClose}
        backToParent
      />
      {metadataLoaded ? (
        <DynaForm
          fieldMeta={fieldMeta}
          formState={formState}
          className={classes.addCategoryDrawerForm}
          optionsHandler={fieldMeta.optionsHandler}>
          <div className={classes.addCategoryDrawerFormActions}>
            <DynaSubmit
              showCustomFormValidations={showCustomFormValidations}
              data-test="addCategory"
              onClick={handleSave}>
              Add Category
            </DynaSubmit>
            <Button variant="text" color="primary" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </DynaForm>
      ) : (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      )}
    </Drawer>
  );
}

export default function CategoryMappingDrawerRoute(props) {
  const match = useRouteMatch();
  const location = useLocation();

  return (
    <Route
      exact
      path={`${match.url}/:flowId/utilitymapping/:categoryId/addCategory`}>
      <LoadResources required resources="flows,exports,imports,connections">
        <AddCategoryMappingDrawer
          {...props}
          parentUrl={location.pathname.replace(/\/addCategory$/, '')}
        />
      </LoadResources>
    </Route>
  );
}
