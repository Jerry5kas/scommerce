<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalUsers' => 0,
                'activeSubscriptions' => 0,
                'todayOrders' => 0,
                'todayDeliveries' => 0,
            ],
        ]);
    }
}
