import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import SettingsIcon from '../../icons/SettingsIcon';
import ActionButton from '../../ActionButton';
import {selectors} from '../../../reducers';
import { emptyObject } from '../../../utils/constants';
import { buildDrawerUrl, drawerPaths } from '../../../utils/rightDrawer';

/**
 * disabled property set to true in case of monitor level access
 */
export default function MappingSettingsButton(props) {
  const {
    dataTest,
    mappingKey,
    disabled,
    isCategoryMapping,
    integrationId,
    flowId,
    editorId,
    depth,
    sectionId,
  } = props;
  const history = useHistory();

  const isDisabled = useSelector(state => {
    let mappings;

    if (isCategoryMapping) {
      if (disabled) return true;
      ({mappings} = selectors.categoryMappingsForSection(state, integrationId, flowId, editorId));
    } else {
      ({ mappings} = selectors.mapping(state));
    }

    const value = mappings?.find(({key}) => key === mappingKey) || emptyObject;

    return !value.generate;
  });
  const handleBtnClick = useCallback(() => {
    if (isCategoryMapping) {
      history.push(buildDrawerUrl({
        path: drawerPaths.MAPPINGS.CATEGORY_MAPPING_SETTINGS,
        baseUrl: history.location.pathname,
        params: { editorId, sectionId, depth, mappingKey },
      }));
    } else {
      history.push(buildDrawerUrl({
        path: drawerPaths.MAPPINGS.SETTINGS,
        baseUrl: history.location.pathname,
        params: { mappingKey },
      }));
    }
  }, [editorId, history, isCategoryMapping, mappingKey, sectionId, depth]);

  return (
    <ActionButton
      data-test={dataTest}
      disabled={isDisabled}
      aria-label="settings"
      onClick={handleBtnClick}
      key="settings">
      <SettingsIcon />
    </ActionButton>
  );
}
