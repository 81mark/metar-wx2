import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Search from './Search';
import useDebounce from './useDebounce';
import MetarReport from './MetarReport';
import Clouds from './Clouds';
import Taf from './Taf';

const Metar = () => {
	const [data, setData] = useState({});
	const [airport, setAirport] = useState('eham');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState({ error: '', message: '' });
	const [toggleMetar, setToggleMetar] = useState(false);

	const debouncedSearchTerm = useDebounce(airport, 1000);

	useEffect(() => {
		if (debouncedSearchTerm && debouncedSearchTerm.length === 4) {
			getMetar();

			async function getMetar() {
				try {
					const results = await axios.get(
						`api/v1/get-metar?q=${debouncedSearchTerm}`
						// `https://api.checkwx.com/metar/${debouncedSearchTerm}/decoded`,
					);

					const metar = results.data.metar;

					// if (metar.length === 0 && debouncedSearchTerm.length === 4) {
					if (results.data.error === 404 && debouncedSearchTerm.length === 4) {
						setError({
							error: 'No Airport Found',
							message: 'Please try a different airport by ICAO, eg EGKK',
						});
						setIsLoading(false);
					} else {
						setError({ error: '', message: '' });
						setData(metar);
						setIsLoading(false);
					}
				} catch (err) {
					console.log('err ', err);
					setError({
						error: 'Error',
						message: 'There was an error getting the data from the server',
					});
					setData([]);
					setIsLoading(false);
				}
			}
		}
	}, [debouncedSearchTerm]);

	const cat = data.flight_category;

	return (
		<>
			<Search airportSearch={(airport) => setAirport(airport)} />

			<button
				className='btn btn-dark btn-block p-2 mt-4 mb-4'
				onClick={() => setToggleMetar(!toggleMetar)}
			>
				{toggleMetar ? 'Back To Metar' : 'To TAF'}
			</button>

			{!isLoading && error.error !== '' && (
				<div className='alert alert-danger mt-4 mb-4 p-2'>
					{error.error}. <br />
					{error.message}
				</div>
			)}
			{!toggleMetar ? (
				!isLoading &&
				error.error === '' && <MetarReport data={data} cat={cat} />
			) : (
				<Taf debouncedSearchTerm={debouncedSearchTerm} cat={cat} />
			)}

			{!toggleMetar && error.error === '' && <Clouds data={data} />}
		</>
	);
};

export default Metar;
