# NumberField
## Description
A React component based on [@mui/material/TextField](https://mui.com/material-ui/react-text-field/). Only allows
valid numbers as input and ignores all else.

## Installation
`npm install @mattyreacts/numberfield`

## Usage
See [MUI TextField API](https://mui.com/material-ui/api/text-field/) for TextField properties

### Extended Properties

| Name          | Type      | Default | Description                                                          |
|---------------|-----------|---------|----------------------------------------------------------------------|
| allowDecimal? | `boolean` | true    | If True then the user can input numbers with decimal places after.   |
| min?          | `number`  | -       | If set then any number below this minimum will be ignored            |
| max?          | `number`  | -       | The value of the field                                               |
| maxDp?        | `number`  | -       | The maximum number of decimal places to allow                        |

## Example
```ts
import * as React from "react";
import { useCallback, useState } from "react";
import NumberField from "@mattyreacts/numberfield";
import { Stack, Typography } from "@mui/material";

function PriceInput(): React.JSX.Element {
    const [price, setPrice] = useState<string>('');

    const handlePriceChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setPrice(event.target.value);
    }, []);

    return (
        <Stack direction="column">
            <Typography variant="body1">{price}</Typography>
            <NumberField value={price}
                onChange={handlePriceChange}
                variant="outlined"
                label="Price"
                allowDecimal
                maxDp={2}
                slotProps={{
                    input: {
                        startAdornment: <InputAdornment position="start">$</InputAdornment>
                    }
                }} 
            />
        </Stack>
    );
}

export default React.memo(PriceInput);
```