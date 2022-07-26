import React from 'react';

//picture title
function Filter(props) {
    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
            }}
        >
            <div
                style={{
                    position: 'relative',
                    marginTop: '0%',
                    width: '100%',
                    fontSize: '16px',
                    height: '40px',
                    lineHeight: '40px',
                    color: 'white',
                }}
            >
                <img
                    src={props.picture}
                    alt="icon"
                    style={{
                        margin: '0% 4%',
                        height: '50%',
                        lineHeight: '40px',
                    }}
                />
                {props.title}
            </div>
            {props.children}
        </div>
    );
}

export default Filter;
