const Integration = require('../models/integrationModel');

const getIntegrationStatus = async (req, res) => {
  try {
    const integrations = await Integration.find();
    res.json(integrations);
  } catch (error) {
    console.error('Error fetching integration status:', error);
    res.status(500).json({ message: 'Error fetching integration status' });
  }
};

const saveIntegration = async (req, res) => {
  const { platform, name, apiKey, apiSecret, sellerId } = req.body;
  try {
    console.log('Request body:', req.body); // Log the request body for debugging
    let integration = await Integration.findOne({ platform });
    if (integration) {
      integration.name = name;
      integration.apiKey = apiKey;
      integration.apiSecret = apiSecret;
      integration.sellerId = sellerId;
      await integration.save();
    } else {
      integration = new Integration({ platform, name, apiKey, apiSecret, sellerId });
      await integration.save();
    }
    res.json(integration);
  } catch (error) {
    console.error('Error saving integration:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error saving integration' });
  }
};

const getIntegrations = async (req, res) => {
  try {
    const integrations = await Integration.find();
    res.json(integrations);
  } catch (error) {
    console.error('Error fetching integrations:', error);
    res.status(500).json({ message: 'Error fetching integrations' });
  }
};

const deleteIntegration = async (req, res) => {
  try {
    const { id } = req.params;
    const integration = await Integration.findById(id);
    if (integration) {
      await integration.remove();
      res.json({ message: 'Integration removed' });
    } else {
      res.status(404).json({ message: 'Integration not found' });
    }
  } catch (error) {
    console.error('Error deleting integration:', error);
    res.status(500).json({ message: 'Error deleting integration' });
  }
};

module.exports = {
  getIntegrationStatus,
  saveIntegration,
  getIntegrations,
  deleteIntegration,
};
