Spoon
-----

Spoon is a quick feedback system based on the big ones,
to help you get started with your new project, and start collecting
user feedback right away.

Go check out the [Spoon website](https://spoon.christiansandor.com)

Get started
-----------
You need to download the `spoon.js` file in the `dist` folder,
and paste it as a script tag before the `</body>` tag as
```
<script src="spoon.js"></script>
```

You can also find the file in this URL:
https://raw.githubusercontent.com/christiansandor/spoon/master/dist/spoon.js


### Work with callbacks
```
<script>
    new Spoon({
        callback: function (obj) {
            console.log(obj);
        }
    });
</script>
```

### Work with callback URLs
```
<script>
    new Spoon({
        callbackUrl: '/api/feedback'
    });
</script>
```

In both cases the object you'll receive will be based on this interface
```
CallbackObject {
    name: string;
    email: string;
    message: string;
    reminder_clicked: boolean;
    reminder_shown: boolean;
    url: string;
}
```

### Options
Nearly every aspect of the module can be customised, with the following properties.

| Property | Default value | What is it for? |
|----------|---------------|-----------------|
| `title` | `Give feedback` | The main title of the popup window |
| `subtitle` | `We'll do our best to action your recommendations.` | The subtitle of the popup window |
| `nameLabel` | `What's your name?` | The label for the name input field |
| `namePlaceholder` | `Joe Bloggs` | The placeholder for the name input field |
| `emailLabel` | `What's your email address?` | The label for the email input field |
| `emailPlaceholder` | `joe.bloggs@email.com` | The placeholder for the email input field |
| `messageLabel` | `What would you like to say?` | The label for the message input field |
| `messagePlaceholder` | `Write your message here...` | The placeholder for the message input field |
| `submitButtonLabel` | `Send feedback` | The submit button's text |
| `submittedMessage` | `<div>Thank you for your feedback!</div> <p>Your feedback has been successfully sent. We'll get back to you if you requested so, or if an issue needs further contact.</p>` | The message displayed when the user sends the feedback |
| `showDelay` | `1000` | The delay in milliseconds before it appears |
| `reminderAuthorMessage` | `` | The reminder message's author text |
| `reminderAuthorIcon` | `` | The reminder message's author icon |
| `reminderMessage` | `` | The reminder message's text |
| `reminderMessageDelay` | `` | The reminder message's delay in milliseconds before it appears |

### Share the 💖 love
It would help a lot if you could ⭐ the repository. :)

#### More
Spoon uses [Icons8](https://icons8.com) free licence for icons.
