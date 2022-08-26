import React, {useEffect, useState} from 'react';
import {Button, Form, Modal, Alert} from 'react-bootstrap';

import {Settings} from 'types/config';

type Props = {
    show: boolean;
    onHide: () => void;
}

enum ValidExe {
    Valid,
    Invalid,
    Checking,
}

const ConfigureModal = (props: Props) => {
    const [config, setConfig] = useState<Settings | undefined>();
    const [saving, setSaving] = useState(false);
    const [isValidExe, setIsValidExe] = useState<number>(ValidExe.Checking);
    const [configExists, setConfigExists] = useState(false);

    const onHide = () => {
        if (!configExists) {
            return;
        }

        props.onHide();
    };

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

    const validateExe = (exePath: string) => {
        setIsValidExe(ValidExe.Checking);
        window.mainApp.verify86Box(exePath).then((result) => {
            setIsValidExe(result ? ValidExe.Valid : ValidExe.Invalid);
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
        if (saving || !config) {
            return;
        }

        setSaving(true);
        window.mainApp.setConfig(config).then((result) => {
            setSaving(false);
            if (!result) {
                alert('Something went wrong saving the config');
            } else {
                props.onHide();
            }
        });
    };

    const renderExeAlert = () => {
        switch (isValidExe) {
            case ValidExe.Valid:
                return (
                    <Alert variant='success'>
                        {'Supported version of 86Box'}
                    </Alert>
                );
            case ValidExe.Invalid:
                return (
                    <Alert variant='danger'>
                        {'Invalid executable or unsupported version of 86Box'}
                    </Alert>
                );
            case ValidExe.Checking:
                return (
                    <Alert variant='primary'>
                        {'Checking if executable is valid 86Box...'}
                    </Alert>
                );
        }
    };

    useEffect(() => {
        const fetchConfig = async () => {
            const fetchedConfig = await window.mainApp.getConfig();
            setConfig(fetchedConfig);
        };
        fetchConfig();
    }, []);

    useEffect(() => {
        if (config?.exePath) {
            validateExe(config.exePath);
        } else {
            setIsValidExe(ValidExe.Invalid);
        }
    }, [config]);

    useEffect(() => {
        if (config?.exePath) {
            setConfigExists(true);
        }
    }, [props.show]);

    if (!config) {
        return null;
    }

    return (
        <Modal
            show={props.show}
            onHide={onHide}
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
                {renderExeAlert()}
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
                    disabled={saving || isValidExe !== ValidExe.Valid}
                >
                    {'Save'}
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default ConfigureModal;
