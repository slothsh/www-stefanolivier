<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactFormRequest;
use App\Mail\ContactFormSubmitted;
use App\Models\LogsEmail;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller {
    public function store(ContactFormRequest $request) {
        try {
            $validated = $request->validated();

            LogsEmail::create($validated);

            $contactFormSubmitted = new ContactFormSubmitted(
                $validated['name'],
                $validated['email'],
                $validated['message']
            );

            Mail::to(config('mail.me.address'))->send($contactFormSubmitted);

            Log::channel('discord')->notice(sprintf("
                📬\n
                **Website Contact Request**\n
                **From:** %s
                **Name:** %s\n
                _%s_
                ",
                $validated['email'],
                $validated['name'],
                $validated['message']
            ));

            return redirect()->back()->with('success', 'Your message has been sent successfully.');
        } catch (\Throwable $t) {
            return redirect()->back()->with('error', 'Your message could not be delivered');
        }
    }
}
