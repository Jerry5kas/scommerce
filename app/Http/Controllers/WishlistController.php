<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;

class WishlistController extends Controller
{
    /**
     * Display the authenticated user's wishlist.
     */
    public function index()
    {
        $user = request()->user();

        if (! $user) {
            abort(403);
        }

        $products = $user->wishlists()
            ->with('product.variants')
            ->get()
            ->pluck('product')
            ->filter()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'slug' => $product->slug,
                    'image' => $product->image,
                    'images' => $product->images,
                    'price' => $product->price,
                    'compare_at_price' => $product->compare_at_price,
                    'unit' => $product->unit,
                    'weight' => $product->weight,
                    'is_subscription_eligible' => $product->is_subscription_eligible,
                    'variants' => $product->variants->map(function ($v) {
                        return [
                            'id' => $v->id,
                            'name' => $v->name,
                            'price' => $v->price,
                            'is_active' => $v->is_active,
                        ];
                    })->toArray(),
                ];
            })->toArray();

        return Inertia::render('Wishlist', ['products' => $products]);
    }

    /**
     * Add or remove a product from the authenticated user's wishlist.
     */
    public function toggle(Product $product)
    {
        $user = request()->user();
        if (! $user) {
            abort(403);
        }

        $existing = $user->wishlists()->where('product_id', $product->id)->first();
        if ($existing) {
            $existing->delete();
            session()->flash('message', 'Product removed from wishlist.');
        } else {
            $user->wishlists()->create(['product_id' => $product->id]);
            session()->flash('message', 'Product added to wishlist.');
        }

        // redirect back so that shared data is recalculated
        return back();
    }
}
