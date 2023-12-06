const marketSchema = require('../schemas/market-schema.js');

module.exports = {
	/**
	 *
	 * @param {String} id
	 * @description Creates the market schema for that item
	 * @returns {Promise<void>}
	 */
	async create(id) {
		await marketSchema.findByIdAndUpdate(
			id,
			{
				_id: id,
			},
			{
				upsert: true,
			}
		);
	},
	async getCheapestSellOrder(id) {
		await this.create(id);
		const result = await marketSchema.findOne({ _id: id });

		var cheapest = Infinity;
		result.sellOrders.forEach((order) => {
			if (order.price < cheapest) cheapest = order.price;
		});
		return cheapest;
	},
	async getSellOrders(id) {
		const result = await marketSchema.findOne({ _id: id });
		return result.sellOrders;
	},
	async getBuyOrders(id) {
		const result = await marketSchema.findOne({ _id: id });
		return result.buyOrders;
	},
};
