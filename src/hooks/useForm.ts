import { useEffect, useMemo, useState } from 'react';

type ValidationFn = (value: any) => boolean;
type FormValidations = Record<string, [ValidationFn, string]>;
type FormValidationState = Record<string, string | null>;

export const useForm = <T extends Record<string, any>>(
    initialForm: T = {} as T,
    formValidations: FormValidations = {}
) => {

    const [formState, setFormState] = useState<T>(initialForm);
    const [formValidation, setFormValidation] = useState<FormValidationState>({});

    useEffect(() => {
        createValidators();
    }, [formState])

    useEffect(() => {
        setFormState(initialForm);
    }, [initialForm])


    const isFormValid = useMemo(() => {

        for (const formValue of Object.keys(formValidation)) {
            if (formValidation[formValue] !== null) return false;
        }

        return true;
    }, [formValidation])


    const onInputChange = ({ target }: { target: HTMLInputElement }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [name]: value
        } as T);
    }

    const onResetForm = () => {
        setFormState(initialForm);
    }

    const createValidators = () => {

        const formCheckedValues: FormValidationState = {};

        for (const formField of Object.keys(formValidations)) {
            const [fn, errorMessage] = formValidations[formField];

            formCheckedValues[`${formField}Valid`] = fn(formState[formField as keyof T]) ? null : errorMessage;
        }

        setFormValidation(formCheckedValues);
    }



    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,

        ...formValidation,
        isFormValid
    }
}