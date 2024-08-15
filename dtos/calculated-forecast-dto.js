module.exports = class CalculatedForecast {
  impressions;
  clicks;
  uniqueUsers;
  bid;
  constructor(model) {
    this.impressions = model.impressions;
    this.clicks = model.clicks;
    this.uniqueUsers = model.uniqueUsers;
    this.bid = model.bid;
  }
};
