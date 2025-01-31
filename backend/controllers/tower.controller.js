import Tower from '../models/tower.model.js';

export const addOrUpdateTowers = async (req, res) => {
  const data = req.body;

  // Check if the request body has the expected structure
  if (!data || !Array.isArray(data.data)) {
    return res.status(400).json({ message: 'Data should be an array of tower objects' });
  }

  const towersData = data.data;

  try {
    const results = await Promise.all(towersData.map(async (towerData) => {
      const { ci, pci, mnc } = towerData;
      let tower = await Tower.findOne({ ci, pci, mnc });
  
      if (tower) {
        // Check if kingfisher_id has changed
        const kingfisher_id_changed = tower.kingfisher_id !== data.kingfisher_id;

        // Update existing tower with timestamps
        tower = await Tower.findOneAndUpdate(
          { ci, pci, mnc },
          {
            ...towerData,
            kingfisher_id: data.kingfisher_id,
            kingfisher_version: data.kingfisher_version,
            last_modified: data.last_modified,
            kingfisher_id_changed // Set the kingfisher_id_changed flag
          },
          { new: true }
        );
      } else {
        // Create new tower with kingfisher metadata
        tower = new Tower({
          ...towerData,
          kingfisher_id: data.kingfisher_id,
          kingfisher_version: data.kingfisher_version,
          last_modified: data.last_modified
        });
        await tower.save();
      }
      return tower;
    }));

    res.status(200).json(results);
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