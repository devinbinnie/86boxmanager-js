import React, {useEffect, useState} from 'react';
import {Badge, Button, Card} from 'react-bootstrap';
import ReactDOM from 'react-dom';

import Header from 'renderer/components/Header';
import ConfigureModal from 'renderer/components/ConfigureModal';
import VMModal from 'renderer/components/VMModal';
import DeleteModal from 'renderer/components/DeleteModal';

import {VM} from 'types/config';

import 'bootstrap/dist/css/bootstrap.min.css';
import {VMStatus} from 'main/constants';

const Root = () => {
    const [isConfigureModalOpen, setIsConfigureModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [vms, setVMs] = useState<VM[]>([]);
    const [vmStatuses, setVMStatuses] = useState<Map<string, VMStatus> | undefined>();

    const [editVm, setEditVm] = useState<(VM & {index: number}) | undefined>();
    const [deleteVm, setDeleteVm] = useState<(VM & {index: number}) | undefined>();

    const getVMs = () => {
        window.mainApp.getVMs().then((result) => {
            setVMs(result);
        });
    };

    const configureVM = async (vm: VM) => {
        await window.mainApp.configureVM(vm);
    };

    const startVM = async (vm: VM) => {
        await window.mainApp.startVM(vm);
    };

    const editVM = (index: number, vm: VM) => {
        setEditVm({...vm, index});
        setIsAddModalOpen(true);
    };

    const deleteVM = (index: number, vm: VM) => {
        setDeleteVm({...vm, index});
        setIsDeleteModalOpen(true);
    };

    const renderStatusBadge = (status: VMStatus) => {
        let className = 'danger';
        let text = 'Error';
        switch (status) {
            case VMStatus.NotConfigured:
                className = 'warning';
                text = 'Not Configured';
                break;
            case VMStatus.Configuring:
                className = 'info';
                text = 'Configuring';
                break;
            case VMStatus.Ready:
                className = 'success';
                text = 'Ready';
                break;
            case VMStatus.Running:
                className = 'primary';
                text = 'Running';
                break;
        }
        return (
            <Badge bg={className}>{text}</Badge>
        );
    };

    const renderVMs = () => {
        return vms.map((vm, index) => {
            const status = vmStatuses?.get(vm.path);
            const isRunning = status === VMStatus.Configuring || status === VMStatus.Running;
            const notReady = status !== VMStatus.Ready;
            return (
                <Card key={index}>
                    <Card.Header>
                        {vm.name}
                        {renderStatusBadge(status)}
                    </Card.Header>
                    <Card.Body>
                        {vm.desc}
                    </Card.Body>
                    <Card.Footer>
                        <Button
                            onClick={() => configureVM(vm)}
                            disabled={isRunning}
                        >
                            {'Configure'}
                        </Button>
                        <Button
                            onClick={() => startVM(vm)}
                            disabled={notReady}
                        >
                            {'Start'}
                        </Button>
                        <Button
                            onClick={() => editVM(index, vm)}
                            disabled={isRunning}
                        >
                            {'Edit'}
                        </Button>
                        <Button
                            onClick={() => deleteVM(index, vm)}
                            disabled={isRunning}
                            variant='danger'
                        >
                            {'Delete'}
                        </Button>
                    </Card.Footer>
                </Card>
            );
        });
    };

    const onUpdateVMStatuses = (_: any, vms: Map<string, VMStatus>) => {
        setVMStatuses(vms);
    };

    useEffect(() => {
        getVMs();
        window.mainApp.registerUpdateVMStatusesListener(onUpdateVMStatuses);
        const fetchConfig = async () => {
            const fetchedConfig = await window.mainApp.getConfig();
            if (!fetchedConfig.exePath) {
                setIsConfigureModalOpen(true);
            }
        };
        fetchConfig();
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
            <DeleteModal
                show={isDeleteModalOpen}
                deleteVm={deleteVm}
                onHide={() => {
                    setIsDeleteModalOpen(false);
                    setDeleteVm(undefined);
                    getVMs();
                }}
            />
        </>
    );
};

ReactDOM.render(
    <Root/>,
    document.getElementById('app'),
);
