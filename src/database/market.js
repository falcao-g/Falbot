const marketSchema = require('../schemas/market-schema.js');

function findSellOrder(array, sellOrder) {
	return array.findIndex(
		(order) => order.price === sellOrder.price && order.amount === sellOrder.amount && order.owner === sellOrder.owner
	);
}

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

		var cheapest = { price: Infinity };
		result.sellOrders.forEach((order) => {
			if (order.price < cheapest.price) cheapest = order;
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
	async deleteSellOrder(id) {
		await marketSchema.deleteOne({ _id: id });
	},
	async subtractQuantityFromSellOrder(item, sellOrder, amount) {
		const result = await marketSchema.findOne({ _id: item });
		var index = findSellOrder(result.sellOrders, sellOrder);
		result.sellOrders[index].amount -= amount;
		if (result.sellOrders[index].amount <= 0) {
			result.sellOrders.splice(index, 1);
		}
		await marketSchema.findByIdAndUpdate(result.id, result);
	},
	async addBuyOrder(item, buyOrder) {
		const result = await marketSchema.findOne({ _id: item });
		result.buyOrders.push(buyOrder);
		await marketSchema.findByIdAndUpdate(result.id, result);
	},
};
