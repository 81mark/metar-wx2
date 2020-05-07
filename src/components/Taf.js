import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TafReport from './TafReport';

const Taf = ({ cat, debouncedSearchTerm }) => {
	const [taf, setTaf] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState({ error: '', message: '' });

	useEffect(() => {
		if (debouncedSearchTerm && debouncedSearchTerm.length === 4) {
			getTaf();

			async function getTaf() {
				try {
					const results = await axios.get(
						`api/v1/get-taf?q=${debouncedSearchTerm}`
						// `https://api.checkwx.com/taf/${debouncedSearchTerm}/decoded`,
					);
					const taf = results.data.taf;

					if (
						// res.data.data.length === 0 &&
						results.data.error === 404 &&
						debouncedSearchTerm.length === 4
					) {
						setError({
							error: 'No TAF or Airport Found',
							message: 'Please try a different airport by ICAO, eg EGKK',
						});
						setIsLoading(false);
					} else {
						setError({ error: '', message: '' });
						setTaf(taf);
						setIsLoading(false);
					}
				} catch (err) {
					setError({
						error: 'Error',
						message: 'There was an error getting the TAF data from the server',
					});
					setIsLoading(false);
				}
			}
		}
	}, [debouncedSearchTerm]);

	return (
		<>
			{!isLoading && error.error !== '' && (
				<div className='alert alert-danger mt-4 mb-4 p-2'>
					{error.error}. <br />
					{error.message}
				</div>
			)}
			{!isLoading && error.error === '' && <TafReport taf={taf} cat={cat} />}
		</>
	);
};

export default Taf;
