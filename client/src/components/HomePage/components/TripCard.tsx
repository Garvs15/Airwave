import React from 'react';

const TripCard: React.FC = () => {
    return (
        <div className='flex border w-full sm:w-[48%] md:w-[31%] lg:w-[31%] xl:w-[31%] rounded-lg items-center py-4 px-3 gap-4'>
            <div className='sm:w-1/3 w-[20%]'>
                <img className='w-full rounded-lg' src='https://www.flydubai.com/en/media/baku_tcm8-6178.jpg' alt='baku' />
            </div>
            <div className='flex flex-col sm:text-sm w-2/3'>
                <div className='font-bold'>Baku, Azerbaijan</div>
                <div className='flex lg:gap-3 md:gap-1 gap-4'>
                    <div>Flights</div>
                </div>
            </div>
        </div>
    );
}

export default TripCard;
