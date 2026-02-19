<?php

namespace App\Http\Controllers;

use App\Http\Requests\ContactFormRequest;
use App\Mail\ContactFormSubmitted;
use App\Models\LogsEmail;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller {
    public function store(ContactFormRequest $request) {
        $validated = $request->validated();

        Mail::to('s.olivier1194@gmail.com')
            ->send(new ContactFormSubmitted(
                $validated['name'],
                $validated['email'],
                $validated['message']
            ));

        LogsEmail::create($validated);

        return redirect()->back()->with('success', 'Your message has been sent successfully.');
    }
}
