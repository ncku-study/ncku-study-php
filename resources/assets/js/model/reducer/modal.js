import {
    OPEN_MODAL,
    CLOSE_MODAL,
    SET_MODAL_CONTEXT,
    SET_MODAL_ON_BEFORE,
    SET_MODAL_ON_NEXT,
    SET_MODAL_ON_CONFIRM,
    CLEAR_MODAL_CONTEXT,
} from '../action/modal';

const initContext = {
    id: -1,
    content: '',
    rawData: undefined,
};

const initState = {
    isOpen: false,
    context: initContext,
    onBefore: undefined,
    onNext: undefined,
    onConfirm: undefined,
};

const modalReducer = (state = initState, action) => {
    switch (action.type) {
        case OPEN_MODAL: {
            return { ...state, isOpen: true };
        }
        case CLOSE_MODAL: {
            return { ...state, isOpen: false };
        }
        case CLEAR_MODAL_CONTEXT:
            return { ...state, context: initContext };
        case SET_MODAL_CONTEXT: {
            const content = action.payload.content;
            return {
                ...state,
                context: content,
            };
        }
        case SET_MODAL_ON_BEFORE: {
            const onBefore = action.payload.onBefore;
            return { ...state, onBefore };
        }
        case SET_MODAL_ON_NEXT: {
            const onNext = action.payload.onNext;
            return { ...state, onNext };
        }
        case SET_MODAL_ON_CONFIRM: {
            const onConfirm = action.payload.onConfirm;
            return { ...state, onConfirm };
        }
        default:
            return state;
    }
};

export default modalReducer;
