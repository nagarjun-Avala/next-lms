
import { useEffect, useState } from 'react';

/**
 * 
 * @param value Value Prop
 * @param delay Time delay Prop
 * @returns debounceValue
 */

export function useDebounce<T>(value: T, delay?: number): T {
    const [debounceValue, setDebounceValue] = useState<T>(value);
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceValue(value)
        }, delay || 500);

        return () => {
            clearTimeout(timer)
        }
    }, [value, delay]);

    return debounceValue;
}