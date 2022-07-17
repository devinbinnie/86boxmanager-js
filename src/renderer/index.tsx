import React, {useEffect, useState} from 'react';
import {Button, Card} from 'react-bootstrap';
import ReactDOM from 'react-dom';

import Header from 'renderer/components/Header';
import ConfigureModal from 'renderer/components/ConfigureModal';
import VMModal from 'renderer/components/VMModal';

import {VM} from 'types/config';

import 'bootstrap/dist/css/bootstrap.min.css';

const Root = () => {
    const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [vms, setVMs] = useState<VM[]>([]);

    const [isBoxRunning, setIsBoxRunning] = useState(false);

    const getVMs = () => {
        window.mainApp.getVMs().then((result) => {
            setVMs(result);
        });
    };

    const configureVM = (vm: VM) => {
        setIsBoxRunning(true);
        window.mainApp.configureVM(vm).then((result) => {
            setIsBoxRunning(false);
        });
    };

    const startVM = (vm: VM) => {
        setIsBoxRunning(true);
        window.mainApp.startVM(vm).then((result) => {
            setIsBoxRunning(false);
        });
    };

    const renderVMs = () => {
        return vms.map((vm) => (
            <Card>
                <Card.Header>
                    {vm.name}
                </Card.Header>
                <Card.Body>
                    {vm.desc}
                </Card.Body>
                <Card.Footer>
                    <Button
                        onClick={() => configureVM(vm)}
                        disabled={isBoxRunning}
                    >
                        {'Configure'}
                    </Button>
                    <Button
                        onClick={() => startVM(vm)}
                        disabled={isBoxRunning}
                    >
                        {'Start'}
                    </Button>
                </Card.Footer>
            </Card>
        ));
    }

    useEffect(() => {
        getVMs();
    }, []);

    return (
        <>
            <div className='Root container-fluid'>
                <Header
                    openAddModal={() => setIsAddModalOpen(true)}
                    openConfigureModal={() => setIsConfigureModalOpen(true)}
                />
                {renderVMs()}
            </div>
            <ConfigureModal
                show={isConfigureModalOpen}
                onHide={() => setIsConfigureModalOpen(false)}
            />
            <VMModal
                show={isAddModalOpen}
                onHide={() => {
                    setIsAddModalOpen(false);
                    getVMs();
                }}
            />
        </>
    )
};

ReactDOM.render(
    <Root/>,
    document.getElementById('app'),
);
