import React from 'react';
import Popover from 'react-bootstrap/Popover';

const useTip = (tip: string) => {
    
    return (
        <Popover id="popover-basic" >
            <Popover.Body>
                {tip}
            </Popover.Body>
        </Popover>
    );
};

export default useTip;