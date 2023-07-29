import React from 'react';
import classes from './AppInput.module.css'

const AppInput = (props: any) => {
    return (
        <input className={classes.appInput} {... props} />
    );
};

export default AppInput;