<?php

namespace App\Livewire\Admin;

use Livewire\Component;
use App\Models\GlobalSetting;
use App\Traits\LogsAudit;

class Settings extends Component
{
    use LogsAudit;
    public $settings = [];

    public function mount()
    {
        $this->loadSettings();
    }

    public function loadSettings()
    {
        $all = GlobalSetting::all();
        $this->settings = $all->pluck('value', 'key')->toArray();
    }

    public function updateSetting($key, $value)
    {
        $setting = GlobalSetting::where('key', $key)->first();
        $oldData = $setting ? $setting->toArray() : null;

        $newSetting = GlobalSetting::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );

        $this->logAction('UPDATE', 'GlobalSetting', $key, $oldData, $newSetting->fresh()->toArray());
        $this->loadSettings();
        $this->dispatch('notify', message: "Ajuste $key actualizado", type: 'success');
    }

    public function render()
    {
        return view('livewire.admin.settings', [
            'descriptions' => GlobalSetting::all()->pluck('description', 'key')->toArray()
        ])->layout('layouts.admin');
    }
}
