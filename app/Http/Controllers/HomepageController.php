<?php

namespace App\Http\Controllers;

use Illuminate\Routing\Controller;
use Inertia\Response;

class HomepageController extends Controller {
    public function index(): Response {
        return inertia('Homepage.svelte');
    }
}
