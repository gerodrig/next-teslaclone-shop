

export const formatCurrency = (value: number, currency: string = 'CAD'): string => {

    const currency2 = currency.length === 3 ? currency : 'CAD';
    //Create formatter
    const formatter = new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency: currency2,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    //Return formatted value
    return `${formatter.format(value)} ${currency}`;

}
