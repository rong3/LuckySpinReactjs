import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar'

function Dialog(props) {
    const {
        children, modalName, shouldCloseOnOverlayClick, size, className, centered, title,
        onClose, onClickOutside, onAfterClose, overlayClassName, shouldCloseOnEsc, onKeypressEscape
    } = props;
    const defaultClassNames = 'modal-dialog modal-dialog-scrollable';
    let classNames = `${defaultClassNames}${size ? ' modal-' + size : ''}`;
    classNames += `${centered ? ' modal-dialog-centered' : ''}`;
    classNames += className ? ` ${className}` : '';
    let overlay = useRef(null);
    useEffect(() => {
        document.addEventListener('keydown', keyboardClose, false)
        return () => {
            document.removeEventListener('keydown', keyboardClose, false)
        };
    }, [])
    const handleClickOverlay = e => {
        const isClickOutside = e.target === overlay
        if (shouldCloseOnOverlayClick && isClickOutside) {
            if (onClickOutside) {
                onClickOutside()
            }
            close()
        }
    }
    const keyboardClose = event => {
        const isKeyCodeEscape = event.keyCode === 27

        if (shouldCloseOnEsc && isKeyCodeEscape) {
            if (onKeypressEscape) {
                onKeypressEscape(event)
            }
            close()
        }
    }
    const close = () => {
        if (onClose) {
            onClose(null);
        }
        props.close(false);
        if (onAfterClose) {
            onAfterClose(null);
        }

    }
    return (
        <div className={`react-dialog-overlay`}
            style={{ zIndex: 2100 }}
            ref={dom => (overlay = dom)}
            onClick={handleClickOverlay}>
            <div className={classNames} id={modalName}>
                <div className="modal-content" style={{ overflow: 'visible' }}>
                    <div className="modal-header dialog-header">
                        <h3 className="modal-title">{title}</h3>
                        <a onClick={close} type="button">
                            <i className="fas fa-times" />
                        </a>
                    </div>
                    {
                        React.Children.map(children, child => {
                            return child;
                        })
                    }
                </div>
            </div>
        </div>
    )
}

Dialog.propTypes = {
    title: PropTypes.string,
    onClickOutside: PropTypes.func,
    onKeypressEscape: PropTypes.func,
    overlayClassName: PropTypes.string,
    className: PropTypes.string,

    children: PropTypes.object,
    size: PropTypes.string,
    centered: PropTypes.bool,
    modalName: PropTypes.string,
    shouldCloseOnOverlayClick: PropTypes.bool,
    shouldCloseOnEsc: PropTypes.bool,
    onClose: PropTypes.func,
    close: PropTypes.func,
    onAfterClose: PropTypes.func,
};

Dialog.defaultProps = {
    isOpen: false,
    title: 'Untitled',
    className: '',
    centered: false,
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEsc: true,
    disableScrollable: false
};

Dialog.Body = function ModalBody(props) {
    return (
        props.disableScrollable ? <div className="modal-body" style={{ overflow: 'visible' }}>{props.children}</div> :
            <PerfectScrollbar options={{
                useBothWheelAxes: false,
                suppressScrollX: true
            }} className="modal-body">
                {props.children}
            </PerfectScrollbar>
    );
};

Dialog.Footer = function ModalBody({ children }) {
    return (
        <div className="modal-footer">
            {children}
        </div>
    );
};

export default Dialog;
