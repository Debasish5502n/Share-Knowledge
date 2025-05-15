import React from 'react';

const CustomDialog = ({ open, onClose, value, onChange, onSave, mode, title }) => {
    if (!open) return null;

    return (
        <div className="dialog-backdrop" onClick={onClose}>
            <div className="custom-dialog" onClick={(e) => e.stopPropagation()}>
                <h3>{mode} {title}</h3>
                <input
                    type="text"
                    placeholder={`Enter ${title} name`}
                    value={value}
                    onChange={onChange}
                />
                <div className="dialog-actions">
                    <button onClick={onClose}>Cancel</button>
                    <button onClick={onSave}>{mode}</button>
                </div>
            </div>
        </div>
    );
};

export default CustomDialog;