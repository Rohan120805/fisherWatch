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
        // Check if location has changed significantly (using ~10m threshold)
        const oldPosition = tower.analysis_report?.pcaps[0]?.gnss_position;
        const newPosition = towerData.analysis_report?.pcaps[0]?.gnss_position;
        
        const locationChanged = oldPosition && newPosition && (
          Math.abs(oldPosition.latitude - newPosition.latitude) > 0.0001 || 
          Math.abs(oldPosition.longitude - newPosition.longitude) > 0.0001
        );

        // Add locationChanged flag to tower data
        tower = await Tower.findOneAndUpdate(
          { ci, pci, mnc },
          { ...towerData, locationChanged },
          { new: true }
        );
      } else {
        // Create new tower with locationChanged set to false initially
        tower = new Tower({
          ...towerData,
          locationChanged: false
        });
        await tower.save();
      }
      return tower;
    }));

    res.status(200).json(results.map(r => r.tower));
  } catch (error) {
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      res.status(400).json({ message: 'Validation error', errors });
    } else {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
};

export const getTowers = async (req, res) => {
  try {
    const towers = await Tower.find({});
    res.status(200).json(towers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};