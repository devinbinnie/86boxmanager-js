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

    const [saving, setSaving] = useState(false);

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
            func = window.mainApp.addVM;
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
                {'Configure Modal'}
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
                <Button
                    onClick={saveVm}
                    disabled={saving}
                >
                    {'Save'}
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default VMModal;