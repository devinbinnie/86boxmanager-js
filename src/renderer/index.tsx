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

    const [editVm, setEditVm] = useState<(VM & {index: number}) | undefined>();

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

    const editVM = (index: number, vm: VM) => {
        setEditVm({...vm, index});
        setIsAddModalOpen(true);
    }

    const renderVMs = () => {
        return vms.map((vm, index) => (
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
                    <Button
                        onClick={() => editVM(index, vm)}
                        disabled={isBoxRunning}
                    >
                        {'Edit'}
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
                editVm={editVm}
                onHide={() => {
                    setIsAddModalOpen(false);
                    setEditVm(undefined);
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
