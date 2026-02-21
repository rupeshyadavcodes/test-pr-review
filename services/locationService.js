// services/locationService.js

const LocationBlock = require('../models/LocationBlock');

async function processLocations(locations) {
  if (!Array.isArray(locations) || locations.length === 0) {
    throw new Error('Locations required');
  }

  const timestamps = locations.map(l => l.timestamp);
  const minTime = Math.min(...timestamps);

  const bulkOps = [];

  for (const location of locations) {


    const existingBlocks = await LocationBlock.find({
      startTime: { $gte: minTime },  
      endTime: { $lte: Date.now() }
    });

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
