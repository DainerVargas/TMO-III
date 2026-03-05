<?php

namespace App\Livewire;

use Livewire\Component;
use Illuminate\Support\Facades\Auth;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use App\Notifications\NewOrderNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;

class OrderCheckout extends Component
{
    public $isOpen = false;
    public $step = 1;

    // Form fields
    public $name, $lastName, $documentType = 'RUC', $documentNumber, $companyName;
    public $phone, $email;
    public $shippingAddress, $shippingDistrict, $shippingReference;

    protected $listeners = ['openCheckout' => 'open'];

    public function mount()
    {
        if (Auth::check()) {
            $user = Auth::user();
            $this->name = $user->name;
            $this->lastName = $user->lastName;
            $this->email = $user->email;
            $this->phone = $user->phone;
            $this->documentType = $user->documentType ?? 'RUC';
            $this->documentNumber = $user->documentNumber;
            $this->companyName = $user->companyName;
            $this->shippingAddress = $user->shippingAddress;
            $this->shippingDistrict = $user->shippingDistrict;
            $this->shippingReference = $user->shippingReference;
        }
    }

    public function open()
    {
        $this->isOpen = true;
        $this->step = 1;
    }

    public function close()
    {
        $this->isOpen = false;
    }

    public function nextStep()
    {
        if ($this->step == 1) {
            $this->validate([
                'name' => 'required|string|max:255',
                'lastName' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'required|string|max:20',
                'documentType' => 'required|in:RUC,DNI',
                'documentNumber' => 'required|string|max:20',
                'companyName' => 'required_if:documentType,RUC|nullable|string|max:255',
            ]);
        } elseif ($this->step == 2) {
            $this->validate([
                'shippingAddress' => 'required|string|max:500',
                'shippingDistrict' => 'required|string|max:255',
            ]);
        }

        $this->step++;
    }

    public function prevStep()
    {
        $this->step--;
    }

    public function sendToWhatsApp()
    {
        $cart = session()->get('cart', []);
        if (empty($cart)) {
            $this->dispatch('notify', message: 'El carrito está vacío', type: 'error');
            return;
        }

        $subtotal = collect($cart)->sum(fn($item) => $item['price'] * $item['quantity']);
        $total = $subtotal * 1.18;

        $text = "*Nuevo Pedido - TMO Suministros*\n\n";
        $text .= "*Cliente:* {$this->name} {$this->lastName}\n";
        $text .= "*Documento:* {$this->documentType} {$this->documentNumber}\n";
        if ($this->companyName) $text .= "*Empresa:* {$this->companyName}\n";
        $text .= "*Teléfono:* {$this->phone}\n";
        $text .= "*Envío:* {$this->shippingAddress}, {$this->shippingDistrict}\n";
        if ($this->shippingReference) $text .= "*Referencia:* {$this->shippingReference}\n\n";

        $text .= "*Productos:*\n";
        foreach ($cart as $item) {
            $text .= "- {$item['name']} (x{$item['quantity']}): S/ " . number_format($item['price'] * $item['quantity'], 2) . "\n";
        }

        $text .= "\n*Total a pagar: S/ " . number_format($total, 2) . "*";

        $url = "https://wa.me/51932621748?text=" . urlencode($text); // Replace with real company number

        // Record order in DB before redirecting
        $this->submitOrder(viaWhatsApp: true);

        return redirect()->away($url);
    }

    public function submitOrder($viaWhatsApp = false)
    {
        $this->validate([
            'shippingAddress' => 'required|string|max:500',
            'shippingDistrict' => 'required|string|max:255',
        ]);

        $cart = session()->get('cart', []);
        if (empty($cart)) {
            if (!$viaWhatsApp) $this->dispatch('notify', message: 'El carrito está vacío', type: 'error');
            return;
        }

        DB::beginTransaction();
        try {
            $subtotal = collect($cart)->sum(fn($item) => $item['price'] * $item['quantity']);
            $igv = $subtotal * 0.18;
            $total = $subtotal + $igv;

            $order = Order::create([
                'userId' => Auth::id(),
                'total' => $total,
                'status' => 'PENDING'
            ]);

            foreach ($cart as $item) {
                OrderItem::create([
                    'orderId' => $order->id,
                    'productId' => $item['id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price']
                ]);
            }

            if (Auth::check()) {
                $user = User::find(Auth::id());
                $user->update([
                    'name' => $this->name,
                    'lastName' => $this->lastName,
                    'documentType' => $this->documentType,
                    'documentNumber' => $this->documentNumber,
                    'companyName' => $this->companyName,
                    'phone' => $this->phone,
                    'shippingAddress' => $this->shippingAddress,
                    'shippingDistrict' => $this->shippingDistrict,
                    'shippingReference' => $this->shippingReference,
                ]);
            }

            DB::commit();

            $admins = User::where('role', 'ADMIN')->get();
            Notification::send($admins, new NewOrderNotification($order));

            session()->forget('cart');
            session()->forget('cart_count');
            $this->dispatch('cart-updated', count: 0);

            if (!$viaWhatsApp) {
                $this->step = 4; // Move to success step
                $this->dispatch('notify', message: '¡Pedido realizado con éxito!', type: 'success');
            }
        } catch (\Exception $e) {
            DB::rollBack();
            if (!$viaWhatsApp) $this->dispatch('notify', message: 'Error al procesar el pedido: ' . $e->getMessage(), type: 'error');
        }
    }

    public function render()
    {
        return view('livewire.order-checkout');
    }
}
