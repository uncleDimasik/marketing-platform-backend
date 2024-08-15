module.exports = class Campaign {
  bannerSize;
  category;
  budget;
  constructor(model) {
    this.bannerSize = model.bannerSize;
    this.category = model.category;
    this.budget = model.budget;
  }
};
