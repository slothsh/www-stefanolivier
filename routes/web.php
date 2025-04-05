<?php

use App\Http\Controllers\BlogController;
use App\Http\Controllers\HomepageController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomepageController::class, 'index'])->name('home.index');
Route::get('/blog', [BlogController::class, 'index'])->name('blog.index');
