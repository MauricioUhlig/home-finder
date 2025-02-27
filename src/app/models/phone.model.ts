export interface Phone {
    Name: string,
    Phone: string
}

export function getEmptyPhone(): Phone {
    return {
        Name: '',
        Phone: ''
    }
}