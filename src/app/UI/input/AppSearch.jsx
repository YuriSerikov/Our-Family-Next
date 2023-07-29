import React from 'react';
import stl from './AppSearch.module.css'

const AppSearch = (props) => {
    return (
            <input className={stl.appInput} {... props} />
    );
};

export default AppSearch;