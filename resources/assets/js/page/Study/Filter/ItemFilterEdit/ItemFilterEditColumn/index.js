import React from 'react';
import { useDispatch } from 'react-redux';
import map from 'lodash/map';
import { START_EDIT_TAG } from '~/model/action/study';
import { AddItemButton, AddItemIcon } from '../style';
import { setStudyTypeOrStat } from '~/model/middleware/study';

import {
    FilterEditColumnContainer,
    EditItemIcon,
    EditItemContainer,
} from './style';
import FilterEditColumnTitle from './../../ItemFilter/ItemFilterColumn/title';

function ItemFilterEditColumn({ optionsArr }) {
    const dispatch = useDispatch();

    const editTag = (type, option) => {
        const { id, name, dataType, max, min } = option;

        dispatch({
            type: START_EDIT_TAG,
            payload: {
                action: 'update',
                tag: { id, type, name, dataType, max, min },
            },
        });
    };

    const createTag = (type) => {
        dispatch({
            type: START_EDIT_TAG,
            payload: {
                action: 'create',
                tag: {
                    type,
                    id: 'temp',
                    name: '',
                    dataType: 'int',
                    min: 0,
                    max: 0,
                },
            },
        });
    };

    return (
        <FilterEditColumnContainer>
            <div>
                <FilterEditColumnTitle optionsArr={optionsArr} />
                {map(optionsArr.options, (option) => (
                    <EditItemContainer key={option.id}>
                        <EditItemIcon
                            onClick={() => editTag(optionsArr.type, option)}
                        />
                        {option.name}
                    </EditItemContainer>
                ))}
            </div>
            <AddItemButton onClick={() => createTag(optionsArr.type)}>
                <AddItemIcon />
                新增項目
            </AddItemButton>
        </FilterEditColumnContainer>
    );
}

export default ItemFilterEditColumn;
