<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class NotificationTestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admins = \App\Models\User::where('role', 'ADMIN')->get();
        $pendingOrders = \App\Models\Order::where('status', 'PENDING')->with('user')->take(3)->get();

        foreach ($admins as $admin) {
            foreach ($pendingOrders as $order) {
                $admin->notify(new \App\Notifications\NewOrderNotification($order));
            }
        }
    }
}
