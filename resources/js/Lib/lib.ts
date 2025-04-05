import './math.ts'
import './vector';
import { route as routeFn } from 'ziggy-js';

type ConditionalClass = string | Record<string, boolean>;
function _mc(defaultClasses: string, conditionals?: ConditionalClass): string {
    const uniqueClasses = new Set<string>(defaultClasses.split(' ').filter(c => c !== ' '));
    if (typeof conditionals === 'object') {
        Object.entries(conditionals)
            .filter(([k, v]) => v)
            .map(([k, v]) => k)
            .forEach(c => uniqueClasses.add(c));
    } else if (conditionals) {
        conditionals.split(' ').filter(c => c !== ' ').forEach(c => uniqueClasses.add(c));
    }

    return Array.from(uniqueClasses).join(' ').trim();
}

declare global {
    var route: typeof routeFn;
    var mc: typeof _mc;
}

(globalThis as any).mc = _mc;

export {};
