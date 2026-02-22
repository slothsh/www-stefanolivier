<?php

use App\Http\Controllers\BlogController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\CvController;
use App\Http\Controllers\FeaturedItemController;
use App\Http\Controllers\HomepageController;
use Illuminate\Support\Facades\Route;

Route::get('/', [HomepageController::class, 'index'])->name('home.index');

Route::get('/api/featured-items', [FeaturedItemController::class, 'index'])->name('featured-items.index');

Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

Route::prefix('/blog')->group(function () {
    Route::get('/', [BlogController::class, 'index'])->name('blog.index');
    Route::get('/{slug}', [BlogController::class, 'show'])->name('blog.show');
});

Route::prefix('/cv')->group(function () {
    Route::get('/{cv}', [CvController::class, 'index'])->name('cv.show');
    Route::get('/{cv}/download', [CvController::class, 'download'])->name('cv.download');
});
