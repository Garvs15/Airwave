import React from 'react';
import TripCard from './components/TripCard';
import TripInfo from './components/TripInfo';

const Trips: React.FC = () => {
    return (
        <div className='w-[90%] mx-auto mt-8 space-y-10'>
            <TripInfo />
            <div className='flex flex-wrap justify-between gap-y-3'>
                <TripCard />
                <TripCard />
                <TripCard />
                <TripCard />
                <TripCard />
                <TripCard />
            </div>
        </div>
    );
};

export default Trips;
