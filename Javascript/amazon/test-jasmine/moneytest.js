import {formatCurrency} from '../scripts/utils/money.js';

describe('test suite: formatCurrency', () => {
    it('should format 100 cents as $1.00', () => {
        expect(formatCurrency(100)).toEqual('1.00');
    });

    it('should format 1234 cents as $12.34', () => {
        expect(formatCurrency(1234)).toBe('12.34');
    });

    it('should format 0 cents as $0.00', () => {
        expect(formatCurrency(0)).toBe('0.00');
    });

    it('should round and format 999 cents as $9.99', () => {
        expect(formatCurrency(999)).toBe('9.99');
    });

    it('should handle negative values correctly', () => {
        expect(formatCurrency(-100)).toBe('-1.00');
    });
});   