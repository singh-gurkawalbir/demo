import Frame from 'react-frame-component';
import { useEffect, Fragment, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as selectors from '../../reducers';
import actions from '../../actions';
import { generateLayoutColumns } from './util';
import Section from './Section';

export default function SalesforceMappingAssistant({
  style = {
    width: '100%',
    height: '500px',
  },
  connectionId,
  disableFetch,
  commMetaPath,
  data,
  onFieldClick,
}) {
  const dispatch = useDispatch();
  const [editLayoutSections, setEditLayoutSections] = useState();
  const layout = useSelector(
    state =>
      selectors.metadataOptionsAndResources({
        state,
        connectionId,
        commMetaPath,
        filterKey: 'salesforce-sObject-layout',
      }).data,
    (left, right) => {
      if (left.errors && right.errors) {
        return left.errors.length === right.errors.length;
      }

      return left.editLayoutSections.length === right.editLayoutSections.length;
    }
  );

  useEffect(() => {
    if (!disableFetch && commMetaPath) {
      dispatch(actions.metadata.request(connectionId, commMetaPath));
    }
  }, [commMetaPath, connectionId, disableFetch, dispatch]);

  useEffect(() => {
    if (layout && layout.editLayoutSections) {
      console.log(
        `${layout.editLayoutSections.length} @ ${new Date().toString()}`
      );
      setEditLayoutSections(
        generateLayoutColumns([...layout.editLayoutSections])
      );
    }
  }, [layout]);

  console.log(`layout ${JSON.stringify(editLayoutSections)}`);

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
            href="https://staging.integrator.io/stylesheets/salesforceDA.css"
            rel="stylesheet"
            type="text/css"
          />
        </Fragment>
      }>
      <div id="salesforceMappingFormMainDiv" className="salesforce-form">
        <h2 className="pageDescription">
          New TEST --- Click in a field below to select ---
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
