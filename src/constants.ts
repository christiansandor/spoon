export interface CallbackObject {
    name: string;
    email: string;
    message: string;
    reminder_clicked: boolean;
    reminder_shown: boolean;
    url: string;
}

export type Callback = (obj: CallbackObject) => void;

interface Options {
    title?: string;
    subtitle?: string;
    nameLabel?: string;
    emailLabel?: string;
    messageLabel?: string;

    showDelay?: number;

    reminderAuthorMessage?: string;
    reminderAuthorIcon?: string;
    reminderMessage?: string;
    reminderMessageDelay?: number;

    namePlaceholder?: string;
    emailPlaceholder?: string;
    messagePlaceholder?: string;

    submitButtonLabel?: string;
    submittedMessage?: string;
}

export interface OptionsWithUrl extends Options {
    callbackUrl: string;
}

export interface OptionsWithCallback extends Options {
    callback: Callback;
}

export interface State {
    active: boolean;
    wasUnfoldedOnce: boolean;
    clickedReminder: boolean;
    shownReminder: boolean;
    closedReminder: boolean;

    buttonShown: boolean;

    unfoldedActive: boolean;
    unfoldedShowing: boolean;
    unfoldedHiding: boolean;

    reminderMessageActive: boolean;
    reminderMessageShowing: boolean;
    reminderMessageHiding: boolean;

    name: string;
    email: string;
    message: string;

    submitted: boolean;
}
