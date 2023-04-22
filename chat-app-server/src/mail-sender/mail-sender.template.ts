export const activeAccountTemplate = (userName: string, link: string) => `
    Dear ${userName},

    Thank you for signing up for ChatApp! We're excited to have you as a new member of our community.

    To complete your registration, please click on the verification link this to activate your account: ${link}

    Once your email is verified, you'll be able to log in to your account and start exploring all of the amazing features that [App Name] has to offer.

    If you have any questions or need assistance with anything, please don't hesitate to reach out to our support team at [Support Email Address].

    Thank you again for choosing Chatapp. We look forward to seeing you inside!

    Best regards,
    ChatApp Team
`;

export const confirmEmail = (userName: string, link: string) => `
Dear ${userName},

As part of our ongoing commitment to keeping your account secure, we recommend changing your password from time to time. If you'd like to change your password now, please click on this link: ${link}

This link will take you to a secure page where you can enter your new password. After submitting your new password, you'll be able to log in to your account using your updated credentials.

If you did not request a password change, or if you have any concerns about the security of your account, please contact our support team at datttp113@gmail.com.

Thank you for choosing ChatApp. We appreciate your business and are committed to providing you with the best possible user experience.

Best regards,
ChatApp Team`;
