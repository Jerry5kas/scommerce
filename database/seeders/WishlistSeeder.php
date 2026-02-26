<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
use App\Models\Wishlist;
use Illuminate\Database\Seeder;

class WishlistSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::take(5)->get();
        $products = Product::all();

        if ($users->isEmpty() || $products->isEmpty()) {
            return;
        }

        foreach ($users as $user) {
            $availableCount = $products->count();
            $requestCount = rand(2, 5);
            $count = min($availableCount, $requestCount);

            $toWishlist = $products->random($count);

            // Handle if $toWishlist is a single model or collection
            $items = ($toWishlist instanceof Product) ? collect([$toWishlist]) : $toWishlist;

            foreach ($items as $product) {
                Wishlist::firstOrCreate([
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                ]);
            }
        }
    }
}
