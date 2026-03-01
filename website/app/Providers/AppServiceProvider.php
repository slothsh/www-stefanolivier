<?php

namespace App\Providers;

use App\Drivers\GotenbergScreenshotDriver;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider {
    /**
     * Register any application services.
     */
    public function register(): void {
        $loader = \Illuminate\Foundation\AliasLoader::getInstance();
        $loader->alias('Debugbar', \Barryvdh\Debugbar\Facades\Debugbar::class);
        $this->app->singleton('laravel-screenshot.driver.gotenberg', function () {
            return new GotenbergScreenshotDriver(config('laravel-screenshot.gotenberg', []));
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void {
        Http::macro('gotenberg', function () {
            $client = Http::baseUrl(env('GOTENBERG_URL', 'http://localhost:3000'));

            if (env('GOTENBERG_USERNAME') !== null || env('GOTENBERG_PASSWORD') !== null) {
                $client->withBasicAuth(env('GOTENBERG_USERNAME', 'gotenberg'), env('GOTENBERG_PASSWORD', ''));
            }

            return $client;
        });
    }
}
