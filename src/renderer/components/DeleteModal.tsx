import React, {useEffect, useState} from 'react';
import {Button, Form, Modal} from 'react-bootstrap';

import {VM} from 'types/config';

type Props = {
    show: boolean;
    onHide: () => void;
    deleteVm?: VM & {index: number};
}

const DeleteModal = (props: Props) => {
    const [deleteFiles, setDeleteFiles] = useState(true);

    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setDeleteFiles(true);
    }, [props.show]);

    const deleteVM = () => {
        if (!props.deleteVm) {
            return;
        }

        if (saving) {
            return;
        }

        setSaving(true);

        window.mainApp.deleteVM(props.deleteVm.index, deleteFiles).then((result) => {
            if (!result) {
                alert('Something went wrong deleting the VM');
            } else {
                props.onHide();
            }
            setSaving(false);
        });
    }
    return (
        <Modal
            show={props.show}
            onHide={props.onHide}
        >
            <Modal.Header>
                {`Delete ${props.deleteVm?.name}`}
            </Modal.Header>
            <Modal.Body>
                <Form.Group controlId='path'>
                    <Form.Check
                        type='checkbox'
                        label='Also delete files on disk'
                        checked={deleteFiles}
                        onChange={(event) => {
                            setDeleteFiles(event.target.checked);
                        }}
                    />
                </Form.Group>
                <Button
                    onClick={deleteVM}
                    disabled={saving}
                    variant='danger'
                >
                    {'Delete'}
                </Button>
            </Modal.Body>
        </Modal>
    );
};

export default DeleteModal;