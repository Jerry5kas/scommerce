<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function index()
    {
        // Get top wishlisted products
        $topWishlistedProducts = Product::withCount('wishlists')
            ->orderBy('wishlists_count', 'desc')
            ->take(10)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'image' => $product->image,
                    'wishlisted_count' => $product->wishlists_count,
                    'price' => $product->price,
                ];
            });

        // Get users with most wishlisted items
        $usersWithWishlists = User::withCount('wishlists')
            ->orderBy('wishlists_count', 'desc')
            ->take(10)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'wishlisted_count' => $user->wishlists_count,
                ];
            });

        // Stats summary
        $stats = [
            'total_wishlisted_items' => Wishlist::count(),
            'unique_users' => Wishlist::distinct('user_id')->count(),
            'unique_products' => Wishlist::distinct('product_id')->count(),
        ];

        return Inertia::render('Admin/Wishlist/Index', [
            'topProducts' => $topWishlistedProducts,
            'topUsers' => $usersWithWishlists,
            'stats' => $stats,
        ]);
    }
}
