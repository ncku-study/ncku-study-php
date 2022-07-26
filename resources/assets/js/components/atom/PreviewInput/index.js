import React from 'react';
import { PreviewLayout, TagIcon } from './style';
import DataMapping from '~/utils/redux/components/modal/dataMapping';
import Label from '../Label';
import { useSelector } from 'react-redux';
import result from 'lodash/result';
import { color } from '~/theme/global';

function PreviewInput({ previewTarget, placeHolder, formType }) {
    const form = useSelector((state) => state.post.form);
    const targetForm = form[formType];
    const { keysTable } = DataMapping.transObjToKeysTable(
        targetForm,
        DataMapping.action.GET_INIT_STUDY
    );
    const obj = { ...result(targetForm, keysTable[previewTarget][0], {}) }; //already handle exception
    obj.value = obj.value.trim();
    const data = !obj.value
        ? { value: placeHolder, color: color.red }
        : { value: obj.value };
    return (
        <PreviewLayout>
            <TagIcon />
            <Label {...data} align="left" size="18px" />
        </PreviewLayout>
    );
}

export default PreviewInput;
