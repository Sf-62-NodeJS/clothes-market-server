const { OrderStatuses } = require('../models');

class OrderStatusesService {
  async getStatuses () {
    const statuses = await OrderStatuses.find().exec();
    return statuses;
  }

  async getStatusInProgress () {
    const status = await OrderStatuses.findOne({
      name: 'In progress'
    }).exec();
    return status;
  }
}

module.exports = OrderStatusesService;
