const userSchema = require('../schemas/user-schema.js');

module.exports = {
	/**
	 *
	 * @param {Snowflake} id
	 * @description Finds a user in the database and if it doesn't exist, creates it
	 * @returns {Promise<object>}
	 */
	async findOne(id) {
		await this.create(id);
		const result = await userSchema.findOne({ _id: id });
		return result;
	},
	/**
	 *
	 * @param {Snowflake} id
	 * @description Creates a user in the database
	 * @returns {Promise<void>}
	 */
	async create(id) {
		await userSchema.findByIdAndUpdate(
			id,
			{
				_id: id,
			},
			{
				upsert: true,
			}
		);
	},
};
