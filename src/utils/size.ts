/** "65", "65\"", "65 inch" and "65 inci" all mean the same size; used to match variants, menu links and spec columns. */
export const sizeKey = (v: string) => v.toLowerCase().replace(/["”″\s]|inci?h?$/g, '')
