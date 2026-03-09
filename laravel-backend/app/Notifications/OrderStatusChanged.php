<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusChanged extends Notification
{
    use Queueable;

    public $order;
    public $message;

    /**
     * Create a new notification instance.
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
        $this->message = "El estado de tu pedido #{$order->id} ha cambiado a: {$order->status}";
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Actualización de tu pedido #' . $this->order->id)
            ->greeting('Hola ' . $notifiable->name . '!')
            ->line($this->message)
            ->action('Ver mi pedido', url('/admin/profile'))
            ->line('Gracias por tu compra!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'ORDER_STATUS_CHANGED',
            'order_id' => $this->order->id,
            'message' => $this->message,
            'status' => $this->order->status,
            'url' => route('admin.profile')
        ];
    }
}
