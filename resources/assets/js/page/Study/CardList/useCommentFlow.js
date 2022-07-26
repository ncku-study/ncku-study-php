import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { studyIndexByIdSelector } from '~/model/selector/study';
import { useModalOpen, useModalContext, useSetModalFlow } from '~/utils/index';
import transIntoModalData from '~/utils/redux/components/modal/transIntoModalData';
import { changeHeaderInfo } from '~/utils/seo/header';
import trans from '~/utils/transition';
import wording from '~/wording/general.json';

const handleHeaderChange = (itemData) => {
    const strMap = {
        schoolName: wording['schoolName'],
        title: itemData['title'],
        websiteTitleShort: wording['websiteTitleShort'],
    };
    changeHeaderInfo(
        trans(wording['header']['studyTitle'], strMap),
        itemData['content']
    );
};

function useCommentFlow({ studyData }) {
    const [, setIsModalOpen] = useModalOpen();
    const [{ index }, setModalContent] = useModalContext();
    const [setModalOnBefore, setModalOnNext] = useSetModalFlow();
    const history = useHistory();
    const indexById = useSelector(studyIndexByIdSelector);

    // Open Reader if id is sets by url when user enter the website.
    useEffect(() => {
        if (indexById >= 0) {
            let itemData = studyData[indexById];
            setModalContent(transIntoModalData('study', itemData, indexById));
            setIsModalOpen(true);
        }
    }, [indexById, studyData, setIsModalOpen, setModalContent]);

    useEffect(() => {
        if (index !== 0) {
            setModalOnBefore(() => {
                let itemData = studyData[index - 1];
                setModalContent(
                    transIntoModalData('study', itemData, index - 1)
                );
                handleHeaderChange(itemData);
                history.push(`?id=${itemData['id']}`);
            });
        } else {
            setModalOnBefore(undefined);
        }
    }, [index, studyData, setModalContent, setModalOnBefore]);

    useEffect(() => {
        if (index + 1 !== studyData.length) {
            setModalOnNext(() => {
                let itemData = studyData[index + 1];
                setModalContent(
                    transIntoModalData('study', itemData, index + 1)
                );
                handleHeaderChange(itemData);
                history.push(`?id=${itemData['id']}`);
            });
        } else {
            setModalOnNext(undefined);
        }
    }, [index, studyData, setModalContent, setModalOnNext]);
}

export default useCommentFlow;
