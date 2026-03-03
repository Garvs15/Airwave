import React from 'react';
import TravelCard from './components/TravelCard';

const Travel: React.FC = () => {
    return (
        <div className='w-[90%] mx-auto space-y-10'>
            <div className='flex justify-between'>
                <div className='space-y-2'>
                    <div className='font-bold text-2xl'>
                        Fall into travel
                    </div>
                    <div className='text-sm'>
                        <div>
                            Going somewhere to celebrate this season? Whether you are going home or somewhere to roam.
                        </div>
                        <div>
                            We've got the travel tools to get you to the destination.
                        </div>
                    </div>
                </div>
                <div>
                    <button className='border p-2 text-sm'>See All</button>
                </div>
            </div>
            <div className='flex justify-between'>
                <TravelCard />
                <TravelCard />
                <TravelCard />
                <TravelCard />
            </div>
        </div>
    )
}

export default Travel;
