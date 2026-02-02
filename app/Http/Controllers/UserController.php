<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateProfileRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function show(Request $request): Response
    {
        $user = $request->user()->only([
            'id',
            'name',
            'email',
            'phone',
            'role',
            'preferred_language',
            'communication_consent',
        ]);

        return Inertia::render('profile/index', [
            'user' => $user,
        ]);
    }

    public function update(UpdateProfileRequest $request): RedirectResponse
    {
        $request->user()->update($request->validated());

        return redirect()->route('profile.index')->with('message', 'Profile updated.');
    }
}
