import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {OptionsWithCallback, OptionsWithUrl} from './constants';
import {SpoonComponent} from './spoon.component';

export class Spoon {
    constructor(options: OptionsWithCallback | OptionsWithUrl) {
        if (!('callbackUrl' in options) && !('callback' in options)) {
            throw new Error('Spoon: You need to provide either "callbackUrl" or "callback"');
        }

        const el = document.createElement('div');
        document.body.appendChild(el);

        ReactDOM.render(React.createElement(SpoonComponent, {
            options: {
                title: `Give feedback`,
                subtitle: `We'll do our best to action your recommendations.`,
                nameLabel: `What's your name?`,
                namePlaceholder: `Joe Bloggs`,
                emailLabel: `What's your email address?`,
                emailPlaceholder: `joe.bloggs@email.com`,
                messageLabel: `What would you like to say?`,
                messagePlaceholder: `Write your message here...`,
                showDelay: 1000,
                submitButtonLabel: `Send feedback`,
                submittedMessage: `
                    <div>Thank you for your feedback!</div>
                    <p>Your feedback has been successfully sent. We'll get back to you if you requested so, or if an issue needs further contact.</p>
                `,
                ...options,
            },
        }), el);
    }
}

(window as any).Spoon = Spoon;
