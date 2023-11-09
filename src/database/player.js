const userSchema = require('../schemas/user-schema.js');

module.exports = {
	async findOne(id) {
		await this.create(id);
		const result = await userSchema.findOne({ _id: id });
		return result;
	},
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
