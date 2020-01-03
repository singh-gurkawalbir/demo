import Frame from 'react-frame-component';
import { useEffect, Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../reducers';
import actions from '../../actions';
import { generateLayoutColumns } from './util';
import Section from './Section';
import { getDomainUrl } from '../../utils/resource';

export default function SalesforceMappingAssistant({
  style = {
    width: '100%',
    height: '500px',
  },
  connectionId,
  sObjectType,
  sObjectLabel,
  layoutId,
  data,
  onFieldClick,
}) {
  const dispatch = useDispatch();
  const [editLayoutSections, setEditLayoutSections] = useState();
  const layout = useSelector(
    state => {
      if (connectionId && sObjectType && layoutId) {
        return selectors.metadataOptionsAndResources({
          state,
          connectionId,
          commMetaPath: `salesforce/metadata/connections/${connectionId}/sObjectTypes/${sObjectType}/layouts?recordTypeId=${layoutId}`,
          filterKey: 'salesforce-sObject-layout',
        }).data;
      }
    },
    (left, right) => {
      if (left.errors && right.errors) {
        return (
          left.errors.length === right.errors.length &&
          left.errors[0].message === right.errors[0].message
        );
      }

      return left.editLayoutSections.length === right.editLayoutSections.length;
    }
  );

  useEffect(() => {
    if (connectionId && sObjectType && layoutId) {
      dispatch(
        actions.metadata.request(
          connectionId,
          `salesforce/metadata/connections/${connectionId}/sObjectTypes/${sObjectType}/layouts?recordTypeId=${layoutId}`
        )
      );
    }
  }, [dispatch, connectionId, sObjectType, layoutId]);

  useEffect(() => {
    if (layout && layout.editLayoutSections) {
      setEditLayoutSections(
        generateLayoutColumns([...layout.editLayoutSections])
      );
    }
  }, [layout]);

  if (!layoutId) {
    return (
      <div id="salesforceMappingFormMainDiv" className="salesforce-form">
        <h2 className="pageDescription">
          {sObjectType || sObjectType} is a non-layoutable entity.
        </h2>
      </div>
    );
  }

  let domainURL = getDomainUrl();

  if (domainURL.includes('localhost')) {
    domainURL = 'https://staging.integrator.io';
  }

  return (
    <Frame
      style={style}
      head={
        <Fragment>
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
        </Fragment>
      }>
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
