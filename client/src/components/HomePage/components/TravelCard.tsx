import React from 'react';

const TravelCard: React.FC = () => {
	const backgroundStyles: React.CSSProperties = {
		backgroundImage: `url(https://www.flydubai.com/en/media/baku_tcm8-6178.jpg)`,
	};

	return (
		<div className='bg-slate-700 w-[23%] h-[400px] rounded-md'>
			<div style={backgroundStyles} className='rounded-md w-full h-full flex flex-col justify-end text-white opacity-100'>
				<div className='p-3'>
					<div className='text-2xl font-bold'>Dubai</div>
					<div className='text-sm'>An amazing journey</div>
				</div>
				<div className='p-3'>
					<button className='bg-blue-500 h-[45px] w-[100%] rounded-md'>Book Flight</button>
				</div>
			</div>
		</div>
	)
}

export default TravelCard;
