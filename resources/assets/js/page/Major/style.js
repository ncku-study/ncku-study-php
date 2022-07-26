import styled from 'styled-components';
import { ScrollBarStyle } from '../../theme/global';

export const Main = styled.main`
    display: grid;
    grid-template-rows: 50px 160px auto;
    overflow-y: hidden;
    overflow-x: hidden;

    @media (max-width: 990px) {
        grid-template-rows: 100px auto;
    }

    @media (max-width: 576px) {
        grid-template-rows: 90px auto;
        margin: 0px -10px;
    }
`;

export const ScrollableContainer = styled.section`
    @media (min-width: 576px) {
        display: contents;
    }

    @media (max-width: 576px) {
        overflow-y: auto;
        ${ScrollBarStyle}
    }
`;
