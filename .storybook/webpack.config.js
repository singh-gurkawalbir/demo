module.exports = async ({config, mode}) => {
    config.node = {
      ...config.node, 
      fs: 'empty'
    };
    
    return config;
  };