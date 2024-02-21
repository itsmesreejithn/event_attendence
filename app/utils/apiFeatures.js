const Events = require("../models/eventModel");
const Participants = require("../models/participantsModel");
const { Op } = require("sequelize");

class ApiFeatures {
  constructor(model, queryString, startDate = null, endDate = null) {
    this.model = model;
    this.queryString = queryString;
    this.options = {};
    this.filters = {};
  }

  paginate() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 5;
    const offset = (page - 1) * limit;

    this.options = {
      ...this.options,
      limit,
      offset,
    };

    return this;
  }

  sort() {
    const sortBy = this.queryString.sortBy || "date";
    const sortOrder = this.queryString.sortOrder || "desc";
    this.options.order = [[sortBy, sortOrder]];
    return this;
  }

  filter() {
    const { filterBy, filterValue, startDate, endDate } = this.queryString;
    if (filterBy === "category" || filterBy === "eventName") {
      this.includeModel(Events, [], filterBy, filterValue);
      return this;
    }
    if (startDate && endDate) {
      this.filters.date = {
        [Op.between]: [startDate, endDate],
      };
    }
    if (filterBy && filterValue) {
      this.filters[filterBy] = filterValue;
    }
    return this;
  }

  includeModel(model, throughAttribute = [], filterBy, filterValue) {
    if (model == Events || model == Participants) {
      if (filterBy === "category") {
        this.options.include = [
          {
            model: model,
            where: {
              category: filterValue,
            },
          },
        ];
      } else {
        this.options.include = [
          {
            model: model,
            where: {
              eventName: filterValue,
            },
          },
        ];
      }
    } else {
      this.options.include = [
        {
          model: model,
          where: {
            category: filterValue,
          },
          through: [{ attibutes: throughAttribute }],
        },
      ];
    }
    return this;
  }

  async execute() {
    if (Object.keys(this.filters).length > 0) {
      this.options.where = { ...this.options.where, ...this.filters };
    }
    return this.model.findAll(this.options);
  }
}

module.exports = ApiFeatures;
