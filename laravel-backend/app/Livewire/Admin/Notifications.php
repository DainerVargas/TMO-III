<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use Illuminate\Support\Facades\Auth;
use App\Traits\LogsAudit;

class Notifications extends Component
{
    use LogsAudit;

    public function getNotificationsProperty()
    {
        return Auth::user()->notifications()->latest()->limit(10)->get();
    }

    public function getUnreadCountProperty()
    {
        return Auth::user()->unreadNotifications()->count();
    }

    public function markAsRead($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->markAsRead();
    }

    public function goToOrder($notifId, $orderId)
    {
        $this->markAsRead($notifId);
        return redirect()->route('admin.orders', ['search' => $orderId]);
    }

    public function markAllAsRead()
    {
        Auth::user()->unreadNotifications->markAsRead();
    }

    public function deleteNotification($id)
    {
        $notification = Auth::user()->notifications()->findOrFail($id);
        $notification->delete();
    }

    public function clearAll()
    {
        Auth::user()->notifications()->delete();
        $this->logAction('CLEAR_ALL', 'Notification', Auth::id());
    }

    public function render()
    {
        return view('livewire.admin.notifications');
    }
}
