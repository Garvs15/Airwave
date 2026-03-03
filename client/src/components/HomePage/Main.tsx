import React from 'react';
import Intro from './components/Intro';
import SearchFlight from './components/SearchFlight';

const Main: React.FC = () => {
    const backgroundStyles: React.CSSProperties = {
        backgroundImage: `url(${require('../../assets/background-image.webp')})`,
    };

    return (
        <div style={backgroundStyles} className='flex flex-col gap-28 justify-center max-sm:items-center h-[calc(100vh-75px)] w-[100%] bg-cover bg-center'>
            <Intro />
            <div className='flex justify-center w-full'>
                <SearchFlight />
            </div>
        </div>
    );
}

export default Main;
