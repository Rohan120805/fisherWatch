import Tower from '../models/tower.model.js';

export const addOrUpdateTowers = async (req, res) => {
  const towersData = req.body;

  if (!Array.isArray(towersData)) {
    return res.status(400).json({ message: 'Data should be an array of tower objects' });
  }

  try {
    const results = await Promise.all(towersData.map(async (towerData) => {
      const { ci, pci, mnc } = towerData;
      let tower = await Tower.findOne({ ci, pci, mnc });
  
      if (tower) {
        // Check if location has changed
        const locationChanged = tower.analysis_report?.pcaps[0]?.gnss_position && 
          towerData.analysis_report?.pcaps[0]?.gnss_position &&
          (tower.analysis_report.pcaps[0].gnss_position.latitude !== towerData.analysis_report.pcaps[0].gnss_position.latitude ||
           tower.analysis_report.pcaps[0].gnss_position.longitude !== towerData.analysis_report.pcaps[0].gnss_position.longitude);
  
        // Add locationChanged flag to tower data
        const updatedTowerData = {
          ...towerData,
          locationChanged: locationChanged || false
        };
  
        // Update existing tower data
        tower = await Tower.findOneAndUpdate(
          { ci, pci, mnc }, 
          updatedTowerData, 
          { new: true }
        );
        return { message: 'Tower data updated successfully', tower };
      } else {
        // Create new tower data
        tower = new Tower({
          ...towerData,
          locationChanged: false
        });
        await tower.save();
        return { message: 'Tower data added successfully', tower };
      }
    }));

    res.status(200).json(results);
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ message: 'Validation error', errors });
    } else {
      res.status(500).json({ message: 'Server error', error });
    }
  }
};

export const getTowers = async (req, res) => {
  try {
    const towers = await Tower.find({});
    res.status(200).json(towers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};