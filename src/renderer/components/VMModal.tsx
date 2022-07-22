import React, {useEffect, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";

import {Settings, VM} from 'types/config';

type Props = {
    show: boolean;
    onHide: () => void;

    editVm?: VM & {
        index: number;
    };
}

const VMModal = (props: Props) => {
    const [config, setConfig] = useState<Settings | undefined>();

    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [path, setPath] = useState('');

    const [importedVMPath, setImportedVMPath] = useState('');
    const [saving, setSaving] = useState(false);

    const importVm = () => {
        if (saving) {
            return;
        }

        window.mainApp.importVM().then((importedVM) => {
            setName(importedVM.name);
            setDesc(importedVM.desc);
            setImportedVMPath(importedVM.path);
        });
    }

    const saveVm = () => {
        if (saving) {
            return;
        }

        setSaving(true);
        const vm = {
            name,
            desc,
            path,
        };

        let func;
        if (props.editVm) {
            func = window.mainApp.editVM(props.editVm.index);
        } else {
            func = window.mainApp.addVM(importedVMPath);
        }

        func(vm).then((result) => {
            if (!result) {
                alert('Something went wrong saving the VM');
            } else {
                props.onHide();
            }
            setSaving(false);
        })
    }

    useEffect(() => {
        if (!props.editVm) {
            setName('');
            setDesc('');
            setPath('');
            setImportedVMPath('');
        }
    }, [props.show]);

    useEffect(() => {
        if (props.editVm) {
            setName(props.editVm.name);
            setDesc(props.editVm.desc);
            setPath(props.editVm.path);
        }
    }, [props.editVm]);

    useEffect(() => {
        const fetchConfig = async () => {
            const fetchedConfig = await window.mainApp.getConfig();
            setConfig(fetchedConfig);
        };
        fetchConfig();
    }, []);

    useEffect(() => {
        if (!config) {
            return;
        }
        setPath(window.path.join(config.cfgPath, name));
    }, [name, config])

    if (!config) {
        return null;
    }

    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
        >
            <Modal.Header>
                {`${props.editVm ? 'Edit' : 'Add'} Modal`}
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId='name'>
                    <Form.Label>{'Name'}</Form.Label>
                    <Form.Control
                        value={name}
                        onChange={(event) => {
                            setName(event.target.value);
                        }}
                    />
                </Form.Group>
                <Form.Group controlId='desc'>
                    <Form.Label>{'Description'}</Form.Label>
                    <Form.Control
                        value={desc}
                        onChange={(event) => {
                            setDesc(event.target.value);
                        }}
                    />
                </Form.Group>
                <Form.Group controlId='path'>
                    <Form.Label>{'Path'}</Form.Label>
                    <Form.Control
                        disabled={true}
                        value={path}
                    />
                </Form.Group>
                {importedVMPath && 
                    <>
                        <br/>
                        {`Imported VM Path: ${importedVMPath}`}
                    </>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={saveVm}
                    disabled={saving}
                >
                    {'Save'}
                </Button>
                {!props.editVm && 
                    <Button
                        onClick={importVm}
                        disabled={saving}
                        variant='success'
                    >
                        {'Import'}
                    </Button>
                }
            </Modal.Footer>
        </Modal>
    );
};

export default VMModal;