import Frame from 'react-frame-component';
import React, { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Spinner } from '@celigo/fuse-ui';
import { selectors } from '../../reducers';
import actions from '../../actions';
import { generateLayoutColumns } from './util';
import Section from './Section';
import { getDomainUrl } from '../../utils/resource';
import useSelectorMemo from '../../hooks/selectors/useSelectorMemo';
import customCloneDeep from '../../utils/customCloneDeep';

export default function SalesforceMappingAssistant({
  connectionId,
  sObjectType,
  sObjectLabel,
  layoutId,
  data,
  onFieldClick,
}) {
  const dispatch = useDispatch();

  const commMetaPath = `salesforce/metadata/connections/${connectionId}/sObjectTypes/${sObjectType}/layouts?recordTypeId=${layoutId}`;
  const {data: layout, status} = useSelectorMemo(selectors.makeOptionsFromMetadata, connectionId, commMetaPath, 'salesforce-sObject-layout') || {};

  useEffect(() => {
    if (connectionId && sObjectType && layoutId) {
      dispatch(
        actions.metadata.request(
          connectionId,
          commMetaPath
        )
      );
    }
  }, [dispatch, connectionId, sObjectType, layoutId, commMetaPath]);

  const editLayoutSections = useMemo(() => layout?.editLayoutSections ? generateLayoutColumns(customCloneDeep(layout.editLayoutSections)) : null, [layout?.editLayoutSections]);

  if (!layoutId) {
    return (
      <div id="salesforceMappingFormMainDiv" className="salesforce-form">
        <h2 className="pageDescription">
          {sObjectLabel || sObjectType} is a non-layoutable entity.
        </h2>
      </div>
    );
  }

  let domainURL = getDomainUrl();

  if (domainURL.includes('localhost')) {
    domainURL = 'https://staging.integrator.io';
  }

  if (status === 'requested') {
    return (
      <Spinner center="screen" />
    );
  }

  return (
    <Frame
      data-test="salesforceMappingAssistant"
      style={{
        width: '100%',
        height: '100%',
      }}
      head={(
        <>
          <link
            href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.0.0-rc2/css/bootstrap.css"
            rel="stylesheet"
            media="screen"
          />
          <link
            href={`${domainURL}/stylesheets/salesforceDA.css`}
            rel="stylesheet"
            type="text/css"
          />
        </>
      )}>
      <div id="salesforceMappingFormMainDiv" className="salesforce-form">
        <h2 className="pageDescription">
          New {sObjectLabel || sObjectType} --- Click in a field below to select
          ---
        </h2>
        <div className="pbBody">
          <form>
            {editLayoutSections &&
              editLayoutSections.map((section, index) => (
                <Section
                  key={section.layoutSectionId}
                  addRequiredInfo={index === 0}
                  section={section}
                  onFieldClick={onFieldClick}
                  data={data}
                />
              ))}
          </form>
        </div>
      </div>
    </Frame>
  );
}
