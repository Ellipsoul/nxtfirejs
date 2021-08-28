import React from 'react'

// Reusable loader component (just using CSS)

export default function Loader({ show }) {
    return ( show ? <div className='loader' /> : null );
};
