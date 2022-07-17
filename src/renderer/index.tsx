import React, {useState} from 'react';
import ReactDOM from 'react-dom';

import Header from 'renderer/components/Header';
import ConfigureModal from 'renderer/components/ConfigureModal';

import 'bootstrap/dist/css/bootstrap.min.css';

const Root = () => {
    const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);

    return (
        <>
            <div className='Root container-fluid'>
                <Header openConfigureModal={() => setIsConfigureModalOpen(true)}/>
            </div>
            <ConfigureModal
                show={isConfigureModalOpen}
                onHide={() => setIsConfigureModalOpen(false)}
            />
        </>
    )
};

ReactDOM.render(
    <Root/>,
    document.getElementById('app'),
);
