class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const filterObj = { ...this.queryString };
    const excludedFields = ["page", "limit", "sort", "fields"];
    excludedFields.forEach((field) => delete filterObj[field]);

    if (Object.keys(filterObj).length > 0) {
      let queryStr = JSON.stringify(filterObj);
      queryStr = queryStr.replace(
        /\b(gte|gt|lte|lt)\b/g,
        (match) => `$${match}`
      );
      const mongoQuery = JSON.parse(queryStr);
      this.query = this.query.find(mongoQuery);
    }
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const selectFields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(selectFields);
    } else {
      this.query = this.query.select("-__v");
    }

    return this;
  }

  paginate() {
    if (this.queryString.page || this.queryString.limit) {
      const pageNum = Number(this.queryString.page) || 1;
      const limitNum = Number(this.queryString.limit) || 10;
      const skip = (pageNum - 1) * limitNum;

      this.query = this.query.skip(skip).limit(limitNum);
    }

    // if (page) {
    //   const total = await Product.countDocuments(mongoQuery);
    //   if (skip >= total) {
    //     return res.status(404).json({
    //       status: "fail",
    //       message: "Page not found",
    //     });
    //   }
    // }

    return this;
  }
}

module.exports = ApiFeatures;
