const marketSchema = require('../schemas/market-schema.js');

function findSellOrder(array, sellOrder) {
	return array.findIndex(
		(order) => order.price === sellOrder.price && order.amount === sellOrder.amount && order.owner === sellOrder.owner
	);
}

function findBuyOrder(array, buyOrder) {
	return array.findIndex(
		(order) => order.price === buyOrder.price && order.amount === buyOrder.amount && order.owner === buyOrder.owner
	);
}

function findOrderByItemAndOwner(array, item, owner) {
	return array.findIndex((order) => order.item === item && order.owner === owner);
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
	async getBestBuyOrder(id) {
		const result = await marketSchema.findOne({ _id: id });

		var best = { price: 0 };
		result.buyOrders.forEach((order) => {
			if (order.price > best.price) best = order;
		});
		return best;
	},
	async getSellOrders(id) {
		const result = await marketSchema.findOne({ _id: id });
		return result.sellOrders;
	},
	async getBuyOrders(id) {
		const result = await marketSchema.findOne({ _id: id });
		return result.buyOrders;
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
	async subtractQuantityFromBuyOrder(item, buyOrder, amount) {
		const result = await marketSchema.findOne({ _id: item });
		var index = findBuyOrder(result.buyOrders, buyOrder);
		result.buyOrders[index].amount -= amount;
		if (result.buyOrders[index].amount <= 0) {
			result.buyOrders.splice(index, 1);
		}
		await marketSchema.findByIdAndUpdate(result.id, result);
	},
	async addBuyOrder(item, buyOrder) {
		const result = await marketSchema.findOne({ _id: item });
		result.buyOrders.push(buyOrder);
		await marketSchema.findByIdAndUpdate(result.id, result);
	},
	async addSellOrder(item, sellOrder) {
		const result = await marketSchema.findOne({ _id: item });
		result.sellOrders.push(sellOrder);
		await marketSchema.findByIdAndUpdate(result.id, result);
	},
	async getBuyOrdersFromUser(id) {
		const result = await marketSchema.find();
		var orders = [];
		result.forEach((item) => {
			item.buyOrders.forEach((order) => {
				if (order.owner === id) orders.push({ ...order, item: item._id });
			});
		});
		return orders;
	},
	async getSellOrdersFromUser(id) {
		const result = await marketSchema.find();
		var orders = [];
		result.forEach((item) => {
			item.sellOrders.forEach((order) => {
				if (order.owner === id) orders.push({ ...order, item: item._id });
			});
		});
		return orders;
	},
	async deleteBuyOrder(item, owner) {
		const result = await marketSchema.findOne({ _id: item });
		var index = findOrderByItemAndOwner(result.buyOrders, item, owner);
		result.buyOrders.splice(index, 1);
		await marketSchema.findByIdAndUpdate(result.id, result);
	},
	async deleteSellOrder(item, owner) {
		const result = await marketSchema.findOne({ _id: item });
		var index = findOrderByItemAndOwner(result.sellOrders, item, owner);
		result.sellOrders.splice(index, 1);
		await marketSchema.findByIdAndUpdate(result.id, result);
	},
};
