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
				`https://api.checkwx.com/metar/${searchWord}/decoded`,
				// `https://api.checkwx.com/metar/xxxx/decoded`,
				{
					headers: {
						'X-API-Key': `${process.env.REACT_APP_TOKEN}`,
					},
				}
			);

			const metar = await results.data.data[0];

			if (results.data.data.length === 0) {
				return res.json({
					success: true,
					error: 404,
				});
			}
			simpleCache.create({
				icao: metar.icao.toLowerCase(),
				type: 'metar',
				data: metar,
			});
			return res.json({
				success: true,
				metar,
			});
		} else if (simpleCache.findOne({ icao: searchWord })) {
			cache = true;
			const metar = simpleCache.findOne({ icao: searchWord });

			return res.json({
				success: true,
				metar,
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
