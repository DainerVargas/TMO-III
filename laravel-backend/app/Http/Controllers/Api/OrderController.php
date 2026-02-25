<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Http\Requests\OrderRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $orders = Order::with(['user', 'orderItems.product'])->get();
        return response()->json($orders);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(OrderRequest $request)
    {
        return DB::transaction(function () use ($request) {
            $validated = $request->validated();

            $total = collect($validated['items'])->sum(function ($item) {
                return $item['price'] * $item['quantity'];
            });

            $order = Order::create([
                'userId' => $validated['userId'],
                'total' => $total,
                'status' => 'PENDING'
            ]);

            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'orderId' => $order->id,
                    'productId' => $item['productId'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price']
                ]);
            }

            // Notify Admins
            $admins = \App\Models\User::where('role', 'ADMIN')->get();
            \Illuminate\Support\Facades\Notification::send($admins, new \App\Notifications\NewOrderNotification($order));

            return response()->json($order->load('orderItems'), 201);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $order = Order::with(['user', 'orderItems.product'])->findOrFail($id);
        return response()->json($order);
    }

    /**
     * Update the specified resource in storage. (Only status update for orders)
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'status' => 'required|string'
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        return response()->json($order);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $order = Order::findOrFail($id);
        $order->delete();
        return response()->json(null, 204);
    }
}
