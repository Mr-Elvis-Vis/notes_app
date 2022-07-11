import re

EXTRA_USER = 'me'
MESSAGE_ERROR_EXTRA_USER = 'The me username is not allowed to be used'


def validate_email(email, username):
    """
    Validation of the email address.
    A-Z 0-9 _ or dot - no more than 30 characters
    :param email:
    :param username:
    :return username:
    """
    if not email:
        raise ValueError(
            'Fill in the "email" field'
        )
    if username == EXTRA_USER:
        raise ValueError(
            MESSAGE_ERROR_EXTRA_USER
        )
    if username is None:
        username = email.split('@')[0]
    if not re.match(r'^[a-zA-Z\d_.]{1,30}$', username):
        raise ValueError(
            'It is allowed to use only letters, numbers and @/./+/-/_.'
        )
    return username
