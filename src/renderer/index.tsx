import React from 'react';
import ReactDOM from 'react-dom';

const Root = () => {
    return (
        <div>{'This is my React app'}</div>
    )
};

ReactDOM.render(
    <Root/>,
    document.getElementById('app'),
);
