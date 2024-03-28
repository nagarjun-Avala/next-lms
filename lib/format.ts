/**
 * @component @name formatPrice
 * @description It is a number formator with defalut style: currency, currency: USD
 *
 * @returns {Steing} Sring
 *
 */

export const formatPrice = (
    value: number,
    locale: string = "en-US",
    style: string = "currency",
    currency: string = "USD",
): string => {
    const options: Intl.NumberFormatOptions = {
        style,
        currency,
    };

    try {
        return new Intl.NumberFormat(locale, options).format(value);
    } catch (error) {
        console.error("Error formatting number:", error);
        return value.toString(); // Return the original value in case of an error.
    }

}
