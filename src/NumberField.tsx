import { FilledTextFieldProps, OutlinedTextFieldProps, StandardTextFieldProps, TextFieldVariants } from "@mui/material";
import * as React from "react";
import { useCallback } from "react";
import { TextField } from '@mui/material';

interface NumberFieldBaseProps {
    /**
     * True to allow decimal numbers, false for integers only
     * @default true
     */
    allowDecimal?: boolean,
    /**
     * The minimum number (inclusive) allowed
     */
    min?: number,
    /**
     * The maximum number (inclusive) allowed
     */
    max?: number,
    /**
     * The maximum number of decimal places that can be entered
     */
    maxDp?: number
}

interface FilledNumberFieldProps extends FilledTextFieldProps, NumberFieldBaseProps {
}

interface StandardNumberFieldProps extends StandardTextFieldProps, NumberFieldBaseProps {
}

interface OutlinedNumberFieldProps extends OutlinedTextFieldProps, NumberFieldBaseProps {
}

type NumberFieldProps<Variant extends TextFieldVariants = TextFieldVariants> =
  Variant extends 'filled'
    ? FilledNumberFieldProps
    : Variant extends 'standard'
      ? StandardNumberFieldProps
      : OutlinedNumberFieldProps;

function NumberField({allowDecimal = true, min, max, maxDp, ...props}: NumberFieldProps, ref: React.ForwardedRef<HTMLInputElement>): React.JSX.Element {
    const handleTextChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
        const value: string = event.target.value;
        if(value === "" || (allowDecimal && value.endsWith(".") && (value.match(/\./g) || []).length <= 1)) {
            if(typeof props.onChange === 'function')
                props.onChange(event);
            return;
        }
        let n: number = 0;
        if(allowDecimal) {
            n = parseFloat(value);
        } else {
            n = parseInt(value);
        }
        if(isNaN(n) || 
            (typeof min === 'number' && n < min) ||
            (typeof max === 'number' && n > max)
        ) {
            event.stopPropagation();
            event.preventDefault();
            return;
        }
        if(typeof maxDp === 'number') {
            const multipler = Math.pow(10, maxDp);
            const compare = Math.round(n * multipler) / multipler;
            if(n > compare)
                event.target.value = compare.toFixed(maxDp);
        }
        if(!isNaN(n) && !allowDecimal)
            event.target.value = n.toString();
        else
            event.target.value = event.target.value.replace(/[^0-9.]+/g,'');
        if(typeof props.onChange === 'function')
            props.onChange(event);
    }, [props.onChange, allowDecimal, min, max]);

    return (
        <TextField 
            {...props} 
            onChange={handleTextChange}
            ref={ref}
        />
    )
}

export default React.forwardRef(NumberField);