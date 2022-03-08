import React, { useCallback } from 'react';
import DataMapping from '~/utils/redux/components/modal/dataMapping';
import omit from 'lodash/omit';
import map from 'lodash/map';
import { postDataList } from './postDataList';
import { postMajorData, postStudyData } from '~/model/middleware/post';
import { useDispatch } from 'react-redux';

function useSubmitTransData(form, type) {
    const dispatch = useDispatch();

    const submitCommitPost = useCallback(() => {
        const params = DataMapping.transFormData(
            form,
            postDataList[type],
            undefined,
            form.id,
            form.confirm,
            true
        );
        params.year = params.year.toString();
        dispatch(postMajorData(params));
    }, [form, type, form.id, form.confirm]);

    const submitStudyPost = useCallback(() => {
        const { keysTable } = DataMapping.transObjToKeysTable(form);
        let pickData = {};
        for (let key in keysTable) {
            pickData[key] = key;
        }

        let paramPackage = DataMapping.transFormData(
            form,
            pickData,
            undefined,
            form.id,
            form.confirm,
            true
        );
        let params = {};

        const settingKeys = postDataList[type].settingKeys;
        map(settingKeys, (key) => {
            params[key] = paramPackage[key];
        });
        pickData = omit(pickData, settingKeys);
        const tags = [];
        map(pickData, (pack) => {
            tags.push({
                name: pack,
                value: paramPackage[pack],
            });
        });
        params.statistic = tags;
        paramPackage = omit(
            paramPackage,
            Object.keys(pickData).concat(settingKeys)
        );
        params = { ...params, ...paramPackage };
        dispatch(postStudyData(params));
    }, [form, type, form.id, form.confirm]);

    const table = { comment: submitCommitPost, study: submitStudyPost };
    return table[type];
}

export default useSubmitTransData;