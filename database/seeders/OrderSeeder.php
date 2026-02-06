<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::whereHas('addresses')->take(5)->get();
        $products = Product::where('is_active', true)->take(10)->get();

        if ($users->isEmpty() || $products->isEmpty()) {
            $this->command->warn('Not enough users or products to seed orders.');

            return;
        }

        $statuses = [
            Order::STATUS_PENDING,
            Order::STATUS_CONFIRMED,
            Order::STATUS_PROCESSING,
            Order::STATUS_OUT_FOR_DELIVERY,
            Order::STATUS_DELIVERED,
            Order::STATUS_CANCELLED,
        ];

        $verticals = ['daily_fresh', 'society_fresh'];

        foreach ($users as $user) {
            // Create 3-5 orders per user
            $orderCount = rand(3, 5);

            for ($i = 0; $i < $orderCount; $i++) {
                $address = $user->addresses()->inRandomOrder()->first();
                if (! $address) {
                    continue;
                }

                $status = $statuses[array_rand($statuses)];
                $vertical = $verticals[array_rand($verticals)];
                $deliveryDate = Carbon::now()->addDays(rand(-7, 7));

                $order = Order::create([
                    'user_id' => $user->id,
                    'user_address_id' => $address->id,
                    'vertical' => $vertical,
                    'type' => Order::TYPE_ONE_TIME,
                    'status' => $status,
                    'subtotal' => 0,
                    'discount' => rand(0, 50),
                    'delivery_charge' => rand(0, 1) ? 0 : 40,
                    'total' => 0,
                    'payment_status' => $status === Order::STATUS_DELIVERED ? Order::PAYMENT_PAID : Order::PAYMENT_PENDING,
                    'payment_method' => 'cod',
                    'scheduled_delivery_date' => $deliveryDate,
                    'scheduled_delivery_time' => rand(0, 1) ? 'morning' : 'evening',
                    'delivered_at' => $status === Order::STATUS_DELIVERED ? $deliveryDate : null,
                    'cancelled_at' => $status === Order::STATUS_CANCELLED ? Carbon::now() : null,
                    'cancellation_reason' => $status === Order::STATUS_CANCELLED ? 'Customer requested cancellation' : null,
                ]);

                // Add 2-5 items to each order
                $itemCount = rand(2, 5);
                $orderProducts = $products->random(min($itemCount, $products->count()));
                $subtotal = 0;

                foreach ($orderProducts as $product) {
                    $quantity = rand(1, 3);
                    $price = $product->price;
                    $itemSubtotal = $price * $quantity;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'product_sku' => $product->sku,
                        'product_image' => $product->image,
                        'quantity' => $quantity,
                        'price' => $price,
                        'subtotal' => $itemSubtotal,
                    ]);

                    $subtotal += $itemSubtotal;
                }

                // Update order totals
                $order->update([
                    'subtotal' => $subtotal,
                    'total' => $subtotal - $order->discount + $order->delivery_charge,
                ]);
            }
        }

        $this->command->info('Orders seeded successfully!');
    }
}
