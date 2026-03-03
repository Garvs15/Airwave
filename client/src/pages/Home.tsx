import React, { useEffect } from 'react';
import Main from '../components/HomePage/Main';
import axios from 'axios';

const Home: React.FC = () => {

	const startServer = () => {
		axios.get(`${process.env.REACT_APP_BACKEND_BOOKING_API}/ping`)
			.catch(() => {
			});
	
		axios.get(`${process.env.REACT_APP_BACKEND_AUTH_API}/ping`)
			.catch(() => {
			});
	};

	useEffect(() => {
		startServer();
	}, []);

	return (
		<div className='flex flex-col items-center gap-20'>
			<Main />
			{/* <Trips />
			<Travel /> */}
		</div>
	);
}

export default Home;
