import React, {useEffect, useState} from 'react';
import {Button, Form, Modal} from "react-bootstrap";

import {Settings} from 'types/config';

type Props = {
    show: boolean;
    onHide: () => void;
}

const ConfigureModal = (props: Props) => {
    const [config, setConfig] = useState<Settings | undefined>();

    const [saving, setSaving] = useState(false);

    const openExePathDialog = () => {
        if (!config) {
            return;
        }

        window.mainApp.openExePathDialog().then((exePath) => {
            setConfig({
                ...config,
                exePath,
            });
        });
    };

    const openCfgPathDialog = () => {
        if (!config) {
            return;
        }

        window.mainApp.openCfgPathDialog().then((cfgPath) => {
            setConfig({
                ...config,
                cfgPath,
            });
        });
    };

    const saveConfig = () => {
        if (saving) {
            return;
        }

        setSaving(true);
        window.mainApp.setConfig(config).then((result) => {
            if (!result) {
                alert('Something went wrong saving the config');
            } else {
                props.onHide();
            }
        })
    }

    useEffect(() => {
        const fetchConfig = async () => {
            const fetchedConfig = await window.mainApp.getConfig();
            setConfig(fetchedConfig);
        };
        fetchConfig();
    }, []);

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
                <Form.Group controlId='exePath'>
                    <Form.Label>{'EXE Path'}</Form.Label>
                    <Form.Control
                        disabled={true}
                        value={config.exePath}
                    />
                    <Button onClick={openExePathDialog}>{'Browse'}</Button>
                </Form.Group>
                <Form.Group controlId='cfgPath'>
                    <Form.Label>{'VM Path'}</Form.Label>
                    <Form.Control
                        disabled={true}
                        value={config.cfgPath}
                    />
                    <Button onClick={openCfgPathDialog}>{'Browse'}</Button>
                </Form.Group>
                <Button
                    onClick={saveConfig}
                    disabled={saving}
                >
                    {'Save'}
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default ConfigureModal;