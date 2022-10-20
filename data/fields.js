import { useFormInput } from "./utils";

export const useSignupFields = () => {

    return [
        {
            id: "name",
            label: "Name",
            required: true,
            input: {
                
                props: {
                    
                    type: "text",
                    placeholder: "Joe Bloggs"
                },
                state: useFormInput("")
            }
        },
        {
            id: "email",
            label: "Email",
            required: true,
            input: {
                
                props: {
                    
                    type: "email",
                    placeholder: "joe@bloggs.com"
                },
                state: useFormInput("")
            }
        },
        {
            id: "password",
            label: "Password",
            required: true,
            input: {
                
                props: {
                    
                    type: "password",
                    placeholder: "*********"
                },
                state: useFormInput("")
            }
        }
    ];
}

export const useCardFields = () => {

    return [
        {
            id: "name",
            label: "Name",
            required: true,
            input: {
                
                props: {
                    type: "name",
                    placeholder: "Name",
                },
                state: useFormInput("")
            }
        },
        {
            id: "cardNumber",
            label: "Card Number",
            required: true,
            input: {
                
                props: {
                    type: "card",
                    placeholder: "XXXX XXXX XXXX XXXX",
                },
                state: useFormInput("")
            }
        },
        {
            id: "expiry",
            label: "Expiry",
            required: true,
            input: {
                
                props: {
                    type: "momth",
                    placeholder: "MM/YY"
                },
                state: useFormInput("")
            }
        },
        {
            id: "cvv",
            label: "CVV",
            required: true,
            input: {
                
                props: {
                    type: "password",
                    placeholder: "***"
                },
                state: useFormInput("")
            }
        }
    ];
}