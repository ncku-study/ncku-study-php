import React from 'react';
import Modal from 'react-modal';

import { ModalStyle } from './style';
import Reader from '../../Reader';
import { useModalOpen } from '~/utils';

function ReaderModal({ isAdmin, onClose }) {
    const [isModalOpen, setIsModalOpen] = useModalOpen();

    return (
        <Modal
            isOpen={isModalOpen}
            contentLabel="Minimal Modal Example"
            className="Modal"
            style={ModalStyle}
            overlayClassName="Overlay"
            onRequestClose={() => {
                setIsModalOpen(false);
                if (onClose) onClose();
            }}
        >
            <Reader isAdmin={isAdmin} />
        </Modal>
    );
}

Modal.setAppElement('body');
export default ReaderModal;
