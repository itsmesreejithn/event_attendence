class ApiFeatures {
  constructor(model, queryString) {
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
    const { filterBy, filterValue } = this.queryString;
    if (filterBy && filterValue) {
      this.filters[filterBy] = filterValue;
    }

    return this;
  }

  includeModel(model, throughAttribute = []) {
    this.options.include = [
      {
        model: model,
        through: { attributes: throughAttribute },
      },
    ];
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
