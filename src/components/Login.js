import React from 'react';
import 'firebase/auth';

export default function Login(props) {

    return (
        <div>
            <button onClick={props.onLogin}>Sign In With Google</button>
        </div>
    )
}