// services/locationService.js

const LocationBlock = require('../models/LocationBlock');

async function processLocations(locations) {
  if (!Array.isArray(locations) || locations.length === 0) {
    throw new Error('Locations required');
  }

  // Safety guard
  if (locations.length > 500) {
    throw new Error('Too many locations in single request');
  }

  const timestamps = locations.map(l => l.timestamp);
  const minTime = Math.min(...timestamps);
  const maxTime = Math.max(...timestamps);

  // Single query
  const existingBlocks = await LocationBlock.find({
    startTime: { $lte: maxTime },
    endTime: { $gte: minTime }
  });

  const bulkOps = [];
  const blockMap = new Map();

  existingBlocks.forEach(block => {
    blockMap.set(block._id.toString(), block);
  });

  for (const location of locations) {
    let matchedBlock = null;

    for (const block of existingBlocks) {
      if (
        location.timestamp >= block.startTime &&
        location.timestamp <= block.endTime
      ) {
        matchedBlock = block;
        break;
      }
    }

    if (matchedBlock) {
      bulkOps.push({
        updateOne: {
          filter: { _id: matchedBlock._id },
          update: { $push: { locations: location } }
        }
      });
    } else {
      bulkOps.push({
        insertOne: {
          document: {
            startTime: location.timestamp,
            endTime: location.timestamp,
            locations: [location]
          }
        }
      });
    }
  }

  if (bulkOps.length > 0) {
    await LocationBlock.bulkWrite(bulkOps);
  }

  return { processed: locations.length };
}

module.exports = { processLocations };
