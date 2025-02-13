import Tower from '../models/tower.model.js';
import fs from 'fs/promises';
import path from 'path';

/**
 * @param {Request} req
 * @param {Response} res
 */
export const addOrUpdateTowers = async (req, res) => {
  const data = req.body;
  if (!data || !Array.isArray(data.data)) {
    return res.status(400).json({ message: 'Data should be an array of tower objects' });
  }

  try {
    const timestamp = new Date(data.last_modified).toISOString()
      .replace(/[:.]/g, '-')
      .replace('T', '_')
      .replace('Z', '');
      
    // Create filename
    const filename = `${data.kingfisher_id}_${timestamp}.json`;
    const savePath = path.join('data', filename);

    // Ensure directory exists
    await fs.mkdir(path.dirname(savePath), { recursive: true });

    // Save raw data to file
    await fs.writeFile(savePath, JSON.stringify(data, null, 2));

    
    const results = await Promise.all(data.data.map(async (towerData) => {
      const { ci, pci, mnc, mcc, tac, lac } = towerData;
      let tower = await Tower.findOne({ ci, pci, mnc, mcc, tac, lac });

      if (tower) {
        return Tower.findOneAndUpdate(
          { ci, pci, mnc }, 
          {
            ...towerData,
            kingfisher_id: data.kingfisher_id,
            kingfisher_version: data.kingfisher_version,
            last_modified: data.last_modified,
            kingfisher_id_changed: tower.kingfisher_id !== data.kingfisher_id
          },
          { new: true }
        );
      } else {
        tower = new Tower({
          ...towerData,
          kingfisher_id: data.kingfisher_id, 
          kingfisher_version: data.kingfisher_version,
          last_modified: data.last_modified
        });
        return tower.save();
      }
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

/**
 * @param {Request} req
 * @param {Response} res
 */
export const getTowers = async (req, res) => {
  try {
    const towers = await Tower.find({});
    res.status(200).json(towers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};