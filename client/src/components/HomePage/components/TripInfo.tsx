import React from 'react';

const TripInfo: React.FC = () => {
    return (
        <div className='flex justify-between gap-2'>
            <div className='flex flex-col gap-2'>
                <div className='font-bold text-2xl'>
                    Plan your perfect trip
                </div>
                <div className='text-sm'>
                    Search Flights for the most popular destinations
                </div>
            </div>
            <div>
                <button className='border p-2 text-sm'>
                    See more places
                </button>
            </div>
        </div>
    );
}

export default TripInfo;
