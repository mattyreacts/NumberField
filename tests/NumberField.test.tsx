import { fireEvent, render, screen } from '@testing-library/react';
import NumberField from '../src';
import React from 'react';

function textChange(input: string, output: string) {
    let text = '';

        const onChange = jest.fn((event: React.ChangeEvent<HTMLInputElement>) => {
            text = event.target.value;
        });
        render(
            <NumberField data-testid="field" onChange={onChange} />
        );

        const field = screen.getByTestId(/field/i)?.querySelector('input') as HTMLElement;

        fireEvent.change(field, { target: { value: input } });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(text).toBe(output);
}

describe('Valid Inputs', () => {
    test('Integer input', () => {
        textChange('5', '5');
    });

    test('decimal input', () => {
        textChange('1.337', '1.337');
    });

    test('decimal point only', () => {
        textChange('.', '.');
    });

    test('decimal input leading decimal point', () => {
        textChange('.1337', '.1337');
    });

    test('decimal input 0.0', () => {
        textChange('0.0', '0.0');
    });

    test('allow zero padding after decimal', () => {
        textChange('1.000', '1.000');
    });

    test('negative symbol only', () => {
        textChange('-', '-');
    });

    test('negative number', () => {
        textChange('-1', '-1');
    });
});

describe('Invalid Inputs', () => {
    test('string input', () => {
        let text = '';

        const onChange = jest.fn((value) => {
            text = value;
        });
        render(
            <NumberField data-testid="field" onChange={onChange} max={5} />
        );

        const input = screen.getByTestId(/field/i)?.querySelector('input') as HTMLElement;

        fireEvent.change(input, { target: { value: '7' } });

        expect(onChange).toHaveBeenCalledTimes(0);
        expect(text).toBe('');
    });

    test('number then character', () => {
        textChange('5a', '5');
    });

    test('greater than max', () => {
        let text = '';

        const onChange = jest.fn((value) => {
            text = value;
        });
        render(
            <NumberField data-testid="field" onChange={onChange} max={5} />
        );

        const input = screen.getByTestId(/field/i)?.querySelector('input') as HTMLElement;

        fireEvent.change(input, { target: { value: '7' } });

        expect(onChange).toHaveBeenCalledTimes(0);
        expect(text).toBe('');
    });

    test('less than min', () => {
        let text = '';

        const onChange = jest.fn((event: React.ChangeEvent<HTMLInputElement>) => {
            text = event.target.value;
        });
        render(
            <NumberField data-testid="field" onChange={onChange} min={5} />
        );

        const input = screen.getByTestId(/field/i)?.querySelector('input') as HTMLElement;

        fireEvent.change(input, { target: { value: '2' } });

        expect(onChange).toHaveBeenCalledTimes(0);
        expect(text).toBe('');
    });

    test('decimal not allowed', () => {
        let text = '';

        const onChange = jest.fn((event: React.ChangeEvent<HTMLInputElement>) => {
            text = event.target.value;
        });
        render(
            <NumberField data-testid="field" onChange={onChange} allowDecimal={false} />
        );

        const input = screen.getByTestId(/field/i)?.querySelector('input') as HTMLElement;

        fireEvent.change(input, { target: { value: '7.123' } });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(text).toBe('7');
    });

    test('Max dp exceeded', () => {
        let text = '';

        const onChange = jest.fn((event: React.ChangeEvent<HTMLInputElement>) => {
            text = event.target.value;
        });
        render(
            <NumberField data-testid="field" onChange={onChange} maxDp={2} />
        );

        const input = screen.getByTestId(/field/i)?.querySelector('input') as HTMLElement;

        fireEvent.change(input, { target: { value: '7.1234' } });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(text).toBe('7.12');
    });

    test('Max dp exceeded rounding up', () => {
        let text = '';

        const onChange = jest.fn((event: React.ChangeEvent<HTMLInputElement>) => {
            text = event.target.value;
        });
        render(
            <NumberField data-testid="field" onChange={onChange} maxDp={2} />
        );

        const input = screen.getByTestId(/field/i)?.querySelector('input') as HTMLElement;

        fireEvent.change(input, { target: { value: '7.5489' } });

        expect(onChange).toHaveBeenCalledTimes(1);
        expect(text).toBe('7.54');
    });
});