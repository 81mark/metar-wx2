const mongoose = require('mongoose');

const SimpleCacheSchema = new mongoose.Schema({
	icao: { type: String, required: true },
	type: { type: String, required: true },
	data: { type: Object, required: true },
	expireAt: {
		type: Date,
		default: Date.now,
		index: { expires: '15m' },
	},
});

// eslint-disable-next-line no-undef
module.exports = simpleCache = mongoose.model('simplecache', SimpleCacheSchema);
