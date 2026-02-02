<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AdminLoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class LoginController extends Controller
{
    public function showLoginForm(): Response
    {
        $messages = session('errors')?->getBag('default')->getMessages() ?? [];
        $errors = collect($messages)->map(fn (array $msgs): string => $msgs[0] ?? '')->all();

        return Inertia::render('admin/login', [
            'errors' => $errors,
            'message' => session('message'),
        ]);
    }

    public function login(AdminLoginRequest $request): RedirectResponse
    {
        $credentials = [
            'email' => $request->validated('login'),
            'password' => $request->validated('password'),
        ];

        if (! Auth::guard('admin')->attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'login' => ['The provided credentials do not match our records.'],
            ])->redirectTo($request->url());
        }

        $request->session()->regenerate();

        return redirect()->intended(route('admin.dashboard'));
    }

    public function logout(): RedirectResponse
    {
        Auth::guard('admin')->logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect()->route('admin.login');
    }
}
