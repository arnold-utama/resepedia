const { Region } = require("../models");

class RegionController {
  static async getAll(req, res, next) {
    try {
      const regions = await Region.findAll();
      res.status(200).json(regions);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = RegionController;
