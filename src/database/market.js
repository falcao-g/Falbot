const marketSchema = require('../schemas/market.js');

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
	async getCheapestSellOrder(item) {
		const result = await marketSchema.aggregate([
			{ $match: { _id: item } }, // Filter by item
			{ $unwind: '$sellOrders' }, // Flatten the sellOrders array
			{ $sort: { 'sellOrders.price': 1 } }, // Sort by price (ascending)
			{ $limit: 1 }, // Get only the cheapest
			{ $project: { _id: 0, order: '$sellOrders' } }, // Return only the order
		]);

		return result.length > 0 ? result[0].order : null; // Return the cheapest order
	},
	async getBestBuyOrder(item) {
		const result = await marketSchema.aggregate([
			{ $match: { _id: item } }, // Filter by item
			{ $unwind: '$buyOrders' }, // Flatten the buyOrders array
			{ $sort: { 'buyOrders.price': -1 } }, // Sort by price (descending)
			{ $limit: 1 }, // Get only the best (highest price)
			{ $project: { _id: 0, order: '$buyOrders' } }, // Return only the order
		]);

		return result.length > 0 ? result[0].order : null; // Return the best order
	},
	async getOrders(item, type) {
		const result = await marketSchema.findOne({ _id: item });
		return result[type + 'Orders'];
	},
	async subtractQuantityFromOrder(item, buyOrder, amount, type) {
		if (buyOrder.amount <= amount) {
			await marketSchema.updateOne(
				{ _id: item },
				{
					$pull: { buyOrders: { _id: buyOrder._id } },
				}
			);
		} else {
			await marketSchema.updateOne(
				{ _id: item, [`${type}Orders._id`]: buyOrder._id },
				{
					$inc: { [`${type}Orders.$.amount`]: -amount },
				}
			);
		}
	},
	async addOrder(item, order, type) {
		const update = type === 'buy' ? { $push: { buyOrders: order } } : { $push: { sellOrders: order } };
		await marketSchema.updateOne({ _id: item }, update);
	},
	async getOrdersFromUser(owner, type) {
		const arrayPath = type === 'buy' ? 'buyOrders' : 'sellOrders';

		const result = await marketSchema
			.aggregate([
				{ $unwind: `$${arrayPath}` }, // Flatten the array
				{ $match: { [`${arrayPath}.owner`]: owner } }, // Match the owner
				{ $project: { _id: 1, order: `$${arrayPath}` } }, // Return marketId and order
			])
			.lean();

		return result;
	},
	async removeOrder(item, semiOrder, type) {
		const filter =
			type === 'buy'
				? { $pull: { buyOrders: { owner: semiOrder.owner, amount: semiOrder.amount, price: semiOrder.price } } }
				: { $pull: { sellOrders: { owner: semiOrder.owner, amount: semiOrder.amount, price: semiOrder.price } } };

		await marketSchema.updateOne({ _id: item }, filter);
	},
	async getHistory(id) {
		const result = await marketSchema.findOne({ _id: id });
		return result.history;
	},
	async addHistory(id, { price, amount, item }) {
		var result = await marketSchema.findOne({ _id: id });
		result.history.unshift({ price, amount, item });
		result.history = result.history.slice(0, 1000);
		result.save();
	},
};
