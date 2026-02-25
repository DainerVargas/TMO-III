<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use App\Models\Product;
use App\Models\Order;
use App\Models\User;
use App\Models\Category;

class Dashboard extends Component
{
    public function render()
    {
        $stats = [
            'totalProducts' => Product::count(),
            'activeProducts' => Product::where('isActive', true)->count(),
            'pendingOrders' => Order::where('status', 'PENDING')->count(),
            'totalStockValue' => Product::sum(\DB::raw('price * stock')),
            'totalUsers' => User::count(),
            'lowStockProducts' => Product::where('stock', '<=', 10)->count(),
        ];

        $recentOrders = Order::with('user')->latest()->take(5)->get();

        // Real Sales Data (last 7 days)
        $salesData = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i);
            $dayName = $date->translatedFormat('D'); // e.g. Lun, Mar
            $total = Order::whereDate('createdAt', $date->toDateString())
                ->whereNotIn('status', ['CANCELLED'])
                ->sum('total');

            $salesData->push([
                'label' => $dayName,
                'total' => (float)$total,
                'fullDate' => $date->toDateString()
            ]);
        }

        // Real Category Distribution
        $categories = Category::withCount('products')->get();
        $totalProducts = Product::count() ?: 1;
        $colors = ['bg-[#0a4d8c]', 'bg-[#0ea5e9]', 'bg-[#f59e0b]', 'bg-[#10b981]', 'bg-[#6366f1]', 'bg-[#f43f5e]', 'bg-[#8b5cf6]'];

        $topCategories = $categories->map(function ($cat, $index) use ($totalProducts, $colors) {
            return [
                'label' => $cat->name,
                'percentage' => round(($cat->products_count / $totalProducts) * 100),
                'color' => $colors[$index % count($colors)]
            ];
        })->sortByDesc('percentage')->take(5)->values()->toArray();

        // If no categories, provide empty state or mock
        if (empty($topCategories)) {
            $topCategories = [['label' => 'Sin Categorías', 'percentage' => 0, 'color' => 'bg-slate-200']];
        }

        return view('livewire.admin.dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'topCategories' => $topCategories,
            'salesData' => $salesData
        ])->layout('layouts.admin');
    }
}
