import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'

const FlightsCount = () => {

  const {totalFlights} = useSelector((state: RootState) => state.flight)

  return (
    <div className='flex flex-col text-white justify-center items-center h-[150px] bg-blue-500'>
      <div className='text-4xl font-semibold'>{totalFlights} tickets found</div>
      <div className='mt-4 max-xs:text-sm'>Please choose a ticket that suits your current needs</div>
      <div className='max-xs:text-sm'>we will always help.</div>
    </div>
  )
}

export default FlightsCount