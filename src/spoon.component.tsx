import * as React from 'react';
import {CallbackObject, OptionsWithCallback, OptionsWithUrl, State} from './constants';
// @ts-ignore
import * as styles from './spoon.scss';

export interface SpoonProps {
    options: OptionsWithCallback | OptionsWithUrl;
}

function uniqid() {
    return Math.random().toString(36).substr(2);
}

export class SpoonComponent extends React.Component<SpoonProps> {
    private readonly nameId = 'spoon-name-' + uniqid();
    private readonly emailId = 'spoon-email-' + uniqid();
    private readonly messageId = 'spoon-message-' + uniqid();

    readonly state: State = {
        active: false,
        closedReminder: localStorage.getItem('spoon-visited') === 'true',

        buttonShown: false,
        clickedReminder: false,
        shownReminder: false,
        wasUnfoldedOnce: false,
        submitted: false,

        email: '',
        message: '',
        name: '',

        reminderMessageActive: false,
        reminderMessageHiding: false,
        reminderMessageShowing: false,

        unfoldedActive: false,
        unfoldedHiding: false,
        unfoldedShowing: false,
    };

    readonly inputRef = React.createRef<HTMLInputElement>();

    options: OptionsWithCallback | OptionsWithUrl;
    contentTimeout: any;
    messageTimeout: any;

    componentWillMount() {
        this.options = this.props.options;
        if (this.options.showDelay) {
            setTimeout(() => {
                this.activate();
            }, this.options.showDelay);
        } else {
            setTimeout(() => {
                this.activate();
            }, 1);
        }
    }

    persistVisited() {
        localStorage.setItem('spoon-visited', 'true');
    }

    activate() {
        this.setState({active: true});

        if (this.options.reminderMessageDelay) {
            this.messageTimeout = setTimeout(() => {
                if (!this.state.closedReminder) {
                    this.toggleReminderMessage(true);
                }
            }, this.options.reminderMessageDelay);
        }

        if (!this.state.submitted) {
            setTimeout(() => {
                this.setState({buttonShown: true});
            }, 10);
        }
    }

    isEnabled() {
        if (this.state.submitted) {
            return false;
        }

        return [
            this.state.name.trim(),
            /^.+@.+\..+$/.test(this.state.email.trim()),
            this.state.message.trim(),
        ].every(Boolean);
    }

    toggleReminderMessage(show: boolean) {
        if (show && this.state.wasUnfoldedOnce) {
            return;
        }

        clearTimeout(this.messageTimeout);
        this.setState({
            reminderMessageShowing: false,
            reminderMessageHiding: false,
        });

        if (show) {
            this.setState({
                reminderMessageActive: true,
                shownReminder: true,
            });
            this.contentTimeout = setTimeout(() => {
                this.setState({reminderMessageShowing: true});
            }, 10);
        } else {
            this.persistVisited();
            this.setState({
                reminderMessageHiding: true,
                closedReminder: true,
            });

            this.contentTimeout = setTimeout(() => {
                this.setState({reminderMessageActive: false});
            }, 600);
        }
    }

    toggleContent() {
        clearTimeout(this.contentTimeout);
        this.persistVisited();

        if (!this.state.unfoldedShowing) {
            this.setState({
                wasUnfoldedOnce: true,
                unfoldedActive: true,
                unfoldedHiding: false,
            });

            if (this.state.reminderMessageActive) {
                this.toggleReminderMessage(false);
            }

            this.contentTimeout = setTimeout(() => {
                this.setState({unfoldedShowing: true});
                if (this.inputRef.current) {
                    this.inputRef.current.focus();
                }
            }, 10);
        } else {
            this.setState({
                unfoldedShowing: false,
                unfoldedHiding: true,
            });

            this.contentTimeout = setTimeout(() => {
                this.setState({unfoldedActive: false});
            }, 600);
        }
    }

    clickedReminder() {
        this.setState({
            clickedReminder: true,
            closedReminder: true,
        });

        this.toggleContent();
    }

    clickedShowContent() {
        if (this.state.submitted) {
            if (this.state.unfoldedShowing) {
                this.toggleContent();
            }

            setTimeout(() => {
                if (this.state.unfoldedHiding && this.state.submitted) {
                    this.setState({buttonShown: false});
                }
            }, 10);
        } else {
            this.toggleContent();
        }
    }

    sendFeedback() {
        if (!this.isEnabled()) {
            return;
        }

        const obj: CallbackObject = {
            name: this.state.name,
            email: this.state.email,
            message: this.state.message,
            reminder_clicked: this.state.clickedReminder,
            reminder_shown: this.state.shownReminder,
            url: location.href,
        };

        if ('callbackUrl' in this.options) {
            const request = new XMLHttpRequest();
            request.open('POST', this.options.callbackUrl, true);
            request.setRequestHeader('Content-Type', 'application/json');
            request.send(JSON.stringify(obj));
        } else if ('callback' in this.options) {
            this.options.callback(obj);
        }

        this.setState({submitted: true});
    }

    nameChanged(event: any) {
        this.setState({name: event.target.value});
    }

    emailChanged(event: any) {
        this.setState({email: event.target.value});
    }

    messageChanged(event: any) {
        this.setState({message: event.target.value});
    }

    render() {
        if (!this.state.active) {
            return null;
        }

        const showBackground = this.state.unfoldedShowing || this.state.reminderMessageShowing;

        const {
            title,
            subtitle,
            nameLabel,
            namePlaceholder,
            emailLabel,
            emailPlaceholder,
            messageLabel,
            messagePlaceholder,
        } = this.options;

        const backgroundClasses = [
            styles.background,
            showBackground && styles.active,
        ].filter(Boolean).join(' ');

        const triggerClasses = [
            styles.trigger,
            this.state.unfoldedShowing && styles.active,
            this.state.buttonShown && styles.showing,
            this.state.reminderMessageShowing && styles.alert,
        ].filter(Boolean).join(' ');

        const messageClasses = [
            styles.message,
            this.state.reminderMessageActive && styles.active,
            this.state.reminderMessageShowing && styles.showing,
            this.state.reminderMessageHiding && styles.hiding,
        ].filter(Boolean).join(' ');

        const contentClasses = [
            styles.content,
            this.state.unfoldedShowing && styles.showing,
            this.state.unfoldedHiding && styles.hiding,
        ].filter(Boolean).join(' ');

        const formClasses = [
            styles.form,
            this.state.submitted && styles.hidden,
        ].filter(Boolean).join(' ');

        const submitButtonClasses = [
            styles.submitButton,
            !this.isEnabled() && styles.disabled,
        ].filter(Boolean).join(' ');

        return (
            <div className={styles.main}>
                <div className={backgroundClasses}/>
                <div className={triggerClasses} onClick={this.clickedShowContent.bind(this)}/>

                {this.options.reminderMessage && (
                    <div className={messageClasses}>
                        <div className={styles.messageClose} onClick={this.toggleReminderMessage.bind(this, false)}/>
                        {this.options.reminderAuthorIcon ? (
                            <div className={styles.messageIcon} style={{
                                background: `url(${this.options.reminderAuthorIcon}) no-repeat center center / cover`,
                            }}/>
                        ) : (
                            <div className={styles.messageIcon}/>
                        )}
                        <div className={styles.messageContent} onClick={this.clickedReminder.bind(this)}>
                            {this.options.reminderAuthorMessage && (
                                <div className={styles.messageAuthor} dangerouslySetInnerHTML={{__html: this.options.reminderAuthorMessage}}/>
                            )}

                            {this.options.reminderMessage && (
                                <div dangerouslySetInnerHTML={{__html: this.options.reminderMessage}}/>
                            )}
                        </div>
                    </div>
                )}

                {this.state.unfoldedActive && (
                    <div className={contentClasses}>
                        <div className={styles.header}>
                            <div className={styles.icon}/>
                            <div className={styles.title}>{title}</div>
                            <div className={styles.subtitle}>{subtitle}</div>
                        </div>
                        <div className={styles.inner}>
                            <div className={formClasses}>
                                <div className={styles.group}>
                                    <label htmlFor={this.nameId} className={styles.label}>{nameLabel}</label>
                                    <input ref={this.inputRef}
                                           id={this.nameId}
                                           type="text"
                                           className={styles.input}
                                           placeholder={namePlaceholder}
                                           onChange={this.nameChanged.bind(this)}
                                           value={this.state.name}
                                           disabled={this.state.submitted}
                                    />
                                </div>
                                <div className={styles.group}>
                                    <label htmlFor={this.emailId} className={styles.label}>{emailLabel}</label>
                                    <input id={this.emailId}
                                           type="text"
                                           className={styles.input}
                                           placeholder={emailPlaceholder}
                                           onChange={this.emailChanged.bind(this)}
                                           value={this.state.email}
                                           disabled={this.state.submitted}
                                    />
                                </div>
                                <div className="spoon-form-group">
                                    <label htmlFor={this.messageId} className={styles.label}>{messageLabel}</label>
                                    <textarea id={this.messageId}
                                              className={styles.textarea}
                                              placeholder={messagePlaceholder}
                                              onChange={this.messageChanged.bind(this)}
                                              value={this.state.message}
                                              disabled={this.state.submitted}
                                    />
                                </div>

                                <div className={styles.buttons}>
                                    <div className={submitButtonClasses} onClick={this.sendFeedback.bind(this)}>
                                        <span dangerouslySetInnerHTML={{__html: this.options.submitButtonLabel as string}}/>
                                    </div>
                                </div>
                            </div>

                            {this.state.submitted && (
                                <div className={styles.submittedMessage}>
                                    <img src={require('./heart.png')} alt=""/>
                                    <div dangerouslySetInnerHTML={{__html: this.options.submittedMessage as string}}/>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        );
    }
}
