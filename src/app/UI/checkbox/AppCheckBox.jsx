import React from 'react';
import classes from '../checkbox/AppCheckBox.module.css';

const AppCheckBox = (props) => {
    return (
       <label className='appLabel'>
            <input type="checkbox" className={classes.appChbx} {...props} />
            {props.label}
        </label>
    );
};

export default AppCheckBox;