<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ContactFormSubmitted extends Mailable {
    use Queueable, SerializesModels;

    public function __construct(
        public string $userName,
        public string $userEmail,
        public string $userMessage,
    ) {}

    public function envelope(): Envelope {
        return new Envelope(
            subject: 'Contact request from ' . $this->userName,
            from: new Address(config('mail.from.address'), config('mail.from.name')),
        );
    }

    public function content(): Content {
        return new Content(
            view: 'emails.contact-form',
        );
    }

    public function attachments(): array {
        return [];
    }
}
