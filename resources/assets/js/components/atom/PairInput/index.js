import React, { useCallback } from 'react';
import Input from '../Input';
import Label from '../Label';
import { PairInputLayout, InputLayout } from './style';

const labelStyle = {
    size: '17px',
    align: 'left',
};
function packDataToElement(name, value) {
    return { target: { value: { name: name, value: value } } };
}

function packDeleteCommand(secret) {
    return { target: { value: { secret: secret } } };
}

function PairInput(props) {
    const { wording, subWording, onChange } = props;
    const { name, value } = props.value;
    const handleTitleChange = useCallback(
        (e) => {
            onChange(packDataToElement(e.target.value, value));
        },
        [onChange, value]
    );
    const handleValueChange = useCallback(
        (e) => {
            onChange(packDataToElement(name, e.target.value));
        },
        [onChange, name]
    );
    const handleDelete = useCallback(
        (e) => {
            // avoid delete the non-spawnable input & anti destroy form by user
            onChange(packDeleteCommand('/!delete_this_input'));
        },
        [onChange]
    );

    return (
        <>
            <Label
                {...labelStyle}
                value={wording}
                onDelete={handleDelete}
                enableDelete
            />
            <PairInputLayout>
                <InputLayout>
                    <Input
                        value={name}
                        wording={subWording[0]}
                        onChange={handleTitleChange}
                    />
                </InputLayout>
                <InputLayout>
                    <Input
                        value={value}
                        wording={subWording[1]}
                        onChange={handleValueChange}
                    />
                </InputLayout>
            </PairInputLayout>
        </>
    );
}

export default PairInput;
