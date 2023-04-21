import React, { useState, useContext, useEffect} from 'react';
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

export const useFeatureVisibility = (featureName, user) => {
  const featureData = useContext(FeatureFlagContext);

  console.log(featureData);
  if (!featureData || !featureData[featureName]) {
    return false;
  }
  const domain = getDomain();
  const feature = featureData.featureName;

  if (feature.enabled === 'true' && feature.enabledDomains.includes(domain)) {
    if (!feature.allowedUsers) {
      return true;
    }

    return feature.allowedUsers.includes(user);
  }

  return false;
};

