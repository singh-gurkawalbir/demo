import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../../../../../reducers';
import actions from '../../../../../../actions';
import DynaForm from '../../../../../../components/DynaForm';
import DynaSubmit from '../../../../../../components/DynaForm/DynaSubmit';
import LoadResources from '../../../../../../components/LoadResources';
import useFormInitWithPermissions from '../../../../../../hooks/useFormInitWithPermissions';
import { TextButton } from '../../../../../../components/Buttons';
import RightDrawer from '../../../../../../components/drawer/Right';
import DrawerHeader from '../../../../../../components/drawer/Right/DrawerHeader';
import DrawerContent from '../../../../../../components/drawer/Right/DrawerContent';
import DrawerFooter from '../../../../../../components/drawer/Right/DrawerFooter';
import { getTrimmedTitle } from '../../../../../../utils/string';
import { drawerPaths } from '../../../../../../utils/rightDrawer';

function AddCategoryMappingDrawer({ integrationId, parentUrl, flowId }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const flowName = useSelector(state => {
    const flow = selectors.resource(state, 'flows', flowId);

    return flow ? flow.name : flowId;
  });
  const metadataLoaded = useSelector(
    state => !!selectors.categoryMapping(state, integrationId, flowId)
  );
  const categoryRelationshipData =
    useSelector(state =>
      selectors.categoryRelationshipData(state, integrationId, flowId)
    ) || [];
  const uiAssistant =
    useSelector(state =>
      selectors.categoryMapping(state, integrationId, flowId)?.uiAssistant || ''
    );
  const handleClose = useCallback(() => {
    history.push(parentUrl);
  }, [history, parentUrl]);
  const handleSave = useCallback(
    ({ category, childCategory, grandchildCategory }) => {
      dispatch(
        actions.integrationApp.settings.categoryMappings.addCategory(integrationId, flowId, {
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
          childCategory.defaultVisible = false;
          childCategory.visible = false;

          return [];
        }

        childCategory.defaultVisible = true;
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
          grandchildCategory.defaultVisible = false;
          grandchildCategory.visible = false;

          return [];
        }

        grandchildCategory.defaultVisible = true;
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
  const formKey = useFormInitWithPermissions({
    fieldMeta,
    optionsHandler: fieldMeta.optionsHandler,
  });

  if (!metadataLoaded) {
    return <Spinner center="screen" />;
  }

  return (
    <>
      <DrawerHeader
        title={`Add category: ${getTrimmedTitle(flowName)}`}
        handleClose={handleClose}
      />
      <DrawerContent>
        <DynaForm formKey={formKey} />
      </DrawerContent>
      <DrawerFooter>
        <DynaSubmit
          formKey={formKey}
          data-test="addCategory"
          onClick={handleSave}>
          Add category
        </DynaSubmit>
        <TextButton onClick={handleClose}>
          Cancel
        </TextButton>
      </DrawerFooter>
    </>
  );
}

export default function AddCategoryMappingDrawerRoute({ integrationId, flowId }) {
  const match = useRouteMatch();

  return (
    <RightDrawer path={drawerPaths.MAPPINGS.CATEGORY_MAPPING.ADD} width="large" height="tall">
      <LoadResources required integrationId={integrationId} resources="connections,flows,exports,imports">
        <AddCategoryMappingDrawer
          integrationId={integrationId}
          flowId={flowId}
          parentUrl={match.url} />
      </LoadResources>
    </RightDrawer>
  );
}
