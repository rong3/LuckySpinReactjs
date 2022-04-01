import React from "react";
import ReactDOM from 'react-dom';

export default async function showDialog(UIComponent, dialogProps) {
    const rootElement = appendToBody('alpDialogPlace');
    const dialogPlace = document.createElement('div');
    dialogPlace.classList.add('alp__modalDialogsPlace');
    rootElement.appendChild(dialogPlace);
    return new Promise((resolve) => {
        const activeElement = document.activeElement;
        const dialogClose = (result) => {
            resolve(result);
            ReactDOM.unmountComponentAtNode(dialogPlace);
            if (activeElement && rootElement.childNodes.length === 1) {
                rootElement.removeChild(dialogPlace)
                activeElement.focus();
            } else {
                rootElement.removeChild(dialogPlace)
            }
        };
        ReactDOM.render(
            <UIComponent {...dialogProps} close={dialogClose} />
            , dialogPlace);
    });
}

function appendToBody(id) {
    let result = document.getElementById(id);

    if (!result) {
        result = document.createElement('div');
        result.setAttribute('id', id);
        result.style.overflow = 'hidden';
        document.body.appendChild(result);
    }

    return result;
}