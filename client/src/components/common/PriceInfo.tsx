import React from 'react'

const PriceInfo = ({ price, currency }: { price: number, currency: string }) => (
  <div>
    <div className="max-md:hidden">Price</div>
    <div className="flex text-2xl font-semibold max-sm:text-lg gap-1">
      <div>{price} /</div>
      <div className="text-gray-400">{currency}</div>
    </div>
  </div>
);

export default PriceInfo