import React, { useState, useContext, useEffect} from 'react';
import { useSelector } from 'react-redux';
import { selectors } from '../../reducers';
import { getDomain } from '../../utils/resource';
import retry from '../../utils/retry';

const FeatureFlagContext = React.createContext({});

export const FeatureFlagProvider = ({ children }) => {
  const [featureData, setfeatureData] = useState({});

  useEffect(() => {
    retry(() => import('./features.json')).then(({ default: features }) => setfeatureData(features));
  }, []);

  return (
    <FeatureFlagContext.Provider
      value={featureData}>
      {children}
    </FeatureFlagContext.Provider>
  );
};

export const useFeautureContext = () => useContext(FeatureFlagContext);

export const useFeatureVisibility = () => {
  const featureData = useContext(FeatureFlagContext);
  const features = Object.keys(featureData);

  console.log({features});
  const {_id: userId} = useSelector(state => selectors.userProfile(state)) || {};
  const domain = getDomain();
  const enabledFeatures = features.filter(featureName => {
    if (!featureData || !featureData[featureName]) {
      return false;
    }
    const feature = featureData[featureName];
    const noUserRestirction = !feature?.allowedUsers || feature?.allowedUsers?.length === 0;
    const noDomainRestriction = !feature?.enabledDomains || feature?.enabledDomains?.length === 0;
    const isCurrentDomainEnabled = feature?.enabledDomains && (feature?.enabledDomains?.length === 0 || feature?.enabledDomains?.includes(domain));
    const isCurrentUserEnabled = feature?.allowedUsers && (feature?.enabledDomains?.length === 0 || feature?.allowedUsers?.includes(userId));

    if (feature?.enabled === 'true') {
      if (noDomainRestriction) {
        return noUserRestirction ? true : isCurrentUserEnabled;
      }
      if (isCurrentDomainEnabled) {
        return noUserRestirction ? true : isCurrentUserEnabled;
      }

      return false;
    }

    return false;
  });

  return enabledFeatures;
};

