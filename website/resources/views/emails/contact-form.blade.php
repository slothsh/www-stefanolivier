<x-mail::message>
    # New Contact Form Submission

    <x-mail::panel>
        **Name:** {{ $name }}<br>
        **Email:** {{ $email }}<br>
        **Message:**<br>
        {{ $message }}
    </x-mail::panel>

    <x-mail::button :url="config('app.url')">
        Visit Website
    </x-mail::button>
</x-mail::message>
