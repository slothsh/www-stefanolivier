<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HttpAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get the token from the Authorization header
        $authorization = $request->header('Authorization');

        if (!$authorization) {
            return response()->json(['message'=> 'Unauthenticated.'], 401);
        }

        // Expecting format: Bearer <token>
        $parts = explode(' ', $authorization);
        if (count($parts) !== 2 || strtolower($parts[0]) !== 'bearer') {
            return response()->json(['message'=> 'Unauthenticated.'], 401);
        }

        $token = $parts[1];

        // Check token against environment variable
        $validToken = config('services.api.token');

        if (!$validToken || $token !== $validToken) {
            return response()->json(['message'=> 'Unauthenticated.'], 401);
        }

        return $next($request);
    }
}
