from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

class CustomUserCreationForm(UserCreationForm):
    email = forms.EmailField(required=True, label='E-mail', widget=forms.EmailInput(
        attrs={
            'class': 'input-style',
        }
    ))

    class Meta:
        model = User
        fields = ('username', 'email', 'password1', 'password2')
