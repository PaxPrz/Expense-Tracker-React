import { useState, useEffect } from 'react';


export default function CurrentTime(props) {
    const [ currentTime, setCurrentTime ] = useState(new Date());
    
    useEffect(() => {
        const now = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(now);
    }, []);

    return (
        <span>{currentTime.toLocaleString()}</span>
    )
}