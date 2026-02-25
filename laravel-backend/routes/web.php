<?php

use Illuminate\Support\Facades\Route;
use App\Livewire\ProductList;
use App\Livewire\Auth\Login;
use App\Livewire\Admin\Dashboard;
use App\Livewire\Admin\Products;
use App\Livewire\Admin\Categories;
use App\Livewire\Admin\Orders;
use App\Livewire\Admin\Users;
use App\Livewire\Admin\Inventory;
use App\Livewire\Admin\Audit;
use App\Livewire\Admin\Settings;
use Illuminate\Support\Facades\Auth;

// Storefront
Route::get('/', ProductList::class)->name('home');
Route::get('/productos', ProductList::class)->name('products');
Route::get('/empresa', \App\Livewire\About::class)->name('about');
Route::get('/contactanos', \App\Livewire\Contact::class)->name('contact');

// Auth
Route::get('/login', Login::class)->name('login');
Route::post('/logout', function () {
    Auth::logout();
    request()->session()->invalidate();
    request()->session()->regenerateToken();
    return redirect('/');
})->name('logout');

// Admin Panel (Protected)
Route::middleware(['auth', 'role.admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', Dashboard::class)->name('dashboard');
    Route::get('/categories', Categories::class)->name('categories');
    Route::get('/products', Products::class)->name('products');
    Route::get('/orders', Orders::class)->name('orders');
    Route::get('/users', Users::class)->name('users');
    Route::get('/inventory', Inventory::class)->name('inventory');
    Route::get('/audit', Audit::class)->name('audit');
    Route::get('/settings', Settings::class)->name('settings');
    Route::get('/profile', \App\Livewire\Admin\Profile::class)->name('profile');
});
