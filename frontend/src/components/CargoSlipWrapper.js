// CargoSlipWrapper.js
import React, { forwardRef } from 'react';
import CargoSlip from './CargoSlip';

const CargoSlipWrapper = forwardRef((props, ref) => (
  <div className="print-only">
    <CargoSlip ref={ref} order={props.order} />
  </div>
));

export default CargoSlipWrapper;
