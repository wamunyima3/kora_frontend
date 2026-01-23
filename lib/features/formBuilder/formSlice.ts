import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'
import { FormField } from '@/components/form-builder/types'

export interface Form {
    id: string
    name: string
    description?: string
    serviceId?: number
    fields: FormField[]
    createdAt: string
    updatedAt: string
}

export interface FormSettings {
    title: string
    description: string
    successMessage: string
    submitButtonText: string
}

interface FormBuilderState {
    forms: Form[]
    currentFormId: string | null
    settings: FormSettings
}

const initialState: FormBuilderState = {
    forms: [],
    currentFormId: null,
    settings: {
        title: '',
        description: '',
        successMessage: 'Thank you! Your form has been submitted successfully.',
        submitButtonText: 'Submit',
    },
}

export const formSlice = createSlice({
    name: 'forms',
    initialState,
    reducers: {
        addForm: (state, action: PayloadAction<Omit<Form, 'id' | 'createdAt' | 'updatedAt'>>) => {
            const now = new Date().toISOString()
            const newForm: Form = {
                ...action.payload,
                id: `form_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                createdAt: now,
                updatedAt: now,
            }
            state.forms.push(newForm)
            state.currentFormId = newForm.id
        },
        updateForm: (state, action: PayloadAction<{ id: string; updates: Partial<Omit<Form, 'id' | 'createdAt'>> }>) => {
            const form = state.forms.find(f => f.id === action.payload.id)
            if (form) {
                Object.assign(form, action.payload.updates, {
                    updatedAt: new Date().toISOString(),
                })
            }
        },
        deleteForm: (state, action: PayloadAction<string>) => {
            state.forms = state.forms.filter(f => f.id !== action.payload)
            if (state.currentFormId === action.payload) {
                state.currentFormId = null
            }
        },
        setCurrentForm: (state, action: PayloadAction<string | null>) => {
            state.currentFormId = action.payload
        },
        updateSettings: (state, action: PayloadAction<Partial<FormSettings>>) => {
            state.settings = { ...state.settings, ...action.payload }
        },
    },
})

export const { addForm, updateForm, deleteForm, setCurrentForm, updateSettings } = formSlice.actions

export const selectAllForms = (state: RootState) => state.forms.forms
export const selectCurrentForm = (state: RootState) => 
    state.forms.forms.find(f => f.id === state.forms.currentFormId) || null
export const selectCurrentFormId = (state: RootState) => state.forms.currentFormId

export default formSlice.reducer
