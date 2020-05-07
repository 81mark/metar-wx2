const express = require('express');
const router = express.Router();
const axios = require('axios');
const simpleCache = require('../models/simpleCache');
let cache = false;

router.get('/', async function (req, res) {
	try {
		const searchWord = `${req.query.q}`;

		if (!cache) {
			const results = await axios.get(
				`https://api.checkwx.com/taf/${searchWord}/decoded`,
				// `https://api.checkwx.com/taf/xxxx/decoded`,
				{
					headers: {
						'X-API-Key': `${process.env.REACT_APP_TOKEN}`,
					},
				}
			);

			const taf = await results.data.data[0];

			if (results.data.data.length === 0) {
				return res.json({
					success: true,
					error: 404,
				});
			}
			simpleCache.create({
				icao: taf.icao.toLowerCase(),
				type: 'taf',
				data: taf,
			});
			return res.json({
				success: true,
				taf,
			});
		} else if (simpleCache.findOne({ icao: searchWord })) {
			cache = true;
			const taf = simpleCache.findOne({ icao: searchWord });

			return res.json({
				success: true,
				taf,
			});
		}
	} catch (err) {
		return res.json({
			success: false,
			// message: `Error with status of ${err.response.status} ${err}`,
			message: `Error with  ${err}`,
		});
	}
});

module.exports = router;
