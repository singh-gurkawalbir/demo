import { Drawer, makeStyles, Button } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
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

const useStyles = makeStyles(theme => ({
  drawerPaper: {
    width: 750,
    border: 'solid 1px',
    borderColor: theme.palette.secondary.lightest,
    boxShadow: `-4px 4px 8px rgba(0,0,0,0.15)`,
    zIndex: theme.zIndex.drawer + 1,
  },
  form: {
    maxHeight: `calc(100vh - 180px)`,
    padding: theme.spacing(2, 3),
  },
}));

function AddCategoryMappingDrawer({ integrationId, parentUrl }) {
  const match = useRouteMatch();
  const { flowId } = match.params;
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const categoryRelationshipData =
    useSelector(state =>
      selectors.categoryRelationshipData(state, integrationId, flowId)
    ) || [];
  const uiAssistant = useSelector(state => {
    const categoryMappingMetadata =
      selectors.categoryMapping(state, integrationId, flowId) || {};
    const { uiAssistant = '' } = categoryMappingMetadata;

    return `${uiAssistant.charAt(0).toUpperCase()}${uiAssistant.slice(1)}`;
  });
  const handleClose = useCallback(() => {
    history.push(parentUrl);
  }, [history, parentUrl]);
  const handleSave = useCallback(
    ({ category, childCategory, grandchildCategory }) => {
      dispatch(
        actions.integrationApp.settings.addCategory(integrationId, flowId, {
          category,
          childCategory,
          grandchildCategory,
        })
      );
      handleClose();
    },
    [dispatch, flowId, handleClose, integrationId]
  );
  const fieldMeta = {
    fieldMap: {
      category: {
        id: 'category',
        name: 'category',
        type: 'select',
        label: 'Choose Category',
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
      open={!!match}>
      <DrawerTitleBar
        flowId={flowId}
        addCategory
        onClose={handleClose}
        backToParent
      />
      <DynaForm fieldMeta={fieldMeta} optionsHandler={fieldMeta.optionsHandler}>
        <DynaSubmit data-test="addCategory" onClick={handleSave}>
          Add Category
        </DynaSubmit>
        <Button variant="text" color="primary" onClick={handleClose}>
          Cancel
        </Button>
      </DynaForm>
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
