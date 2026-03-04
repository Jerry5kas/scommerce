<?php

namespace Database\Seeders;

use App\Models\Collection;
use App\Models\Product;
use Illuminate\Database\Seeder;

class CollectionSeeder extends Seeder
{
    public function run(): void
    {
        // ── Clean slate — unlink products, then remove old collections ────────
        Product::query()->whereNotNull('collection_id')->update(['collection_id' => null]);
        Collection::query()->delete();

        // ── Create the single "Farm Fresh Dairy" collection ──────────────────
        // Groups all our current dairy products: Ghee, Curd, Paneer, Buttermilk, Butter
        $collection = Collection::query()->create([
            'name' => 'Farm Fresh Dairy',
            'slug' => 'farm-fresh-dairy',
            'description' => 'Our signature range of pure, farm-fresh dairy products — made from ethically sourced cow milk, traditionally churned, and delivered fresh to your doorstep every day.',
            'banner_image' => '/demo/Ghee.png',
            'banner_mobile_image' => '/demo/Ghee.png',
            'display_order' => 1,
            'is_active' => true,
            'vertical' => 'both',
            'starts_at' => now()->subDay(),
            'ends_at' => null, // evergreen collection
        ]);

        // ── Assign every existing product to this collection ─────────────────
        $updated = Product::query()->update(['collection_id' => $collection->id]);

        $this->command->info("✅  Collection \"{$collection->name}\" created (ID {$collection->id})");
        $this->command->info("    → Linked {$updated} product(s) to this collection.");
        $this->command->newLine();
        $this->command->info('🎉  CollectionSeeder finished.');
    }
}
