<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class InitialDataSeeder extends Seeder
{
    public function run(): void
    {
        // Disable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // Clear existing data
        DB::table('user')->truncate();
        DB::table('auditlog')->truncate();
        DB::table('category')->truncate();
        DB::table('product')->truncate();
        DB::table('order')->truncate();
        DB::table('orderitem')->truncate();
        DB::table('stockmovement')->truncate();

        // 1. Categories
        DB::table('category')->insert([
            ['id' => 'cafeteria', 'name' => 'Cafetería y Alimentos', 'icon' => 'Coffee'],
            ['id' => 'empaque', 'name' => 'Empaque y Embalaje', 'icon' => 'Package'],
            ['id' => 'limpieza', 'name' => 'Limpieza e Higiene', 'icon' => 'Sparkles'],
            ['id' => 'oficina', 'name' => 'Útiles de Oficina', 'icon' => 'PenLine'],
            ['id' => 'sabanillas', 'name' => 'Sabanillas', 'icon' => 'ClipboardList'],
            ['id' => 'seguridad', 'name' => 'Seguridad Industrial', 'icon' => 'Shield'],
            ['id' => 'tecnologia', 'name' => 'Tecnología y Accesorios', 'icon' => 'Monitor'],
        ]);

        // 2. Users
        DB::table('user')->insert([
            [
                'id' => 1,
                'email' => 'admin@tmo.com.pe',
                'password' => '$2y$12$.SpTG6FcaiMujPgN/Fk8lu6Q3IA2SqzLUnYRJL59ya2xS8guz01M.',
                'name' => 'Admin ',
                'role' => 'ADMIN',
                'phone' => '132465798',
                'ruc' => null,
                'createdAt' => '2026-02-23 16:59:09.134',
                'updatedAt' => '2026-02-23 19:23:45.292',
                'companyName' => null,
                'documentNumber' => '9876543210',
                'documentType' => null,
                'lastName' => 'TMO',
                'isActive' => 1,
                'permissions' => null,
            ],
            [
                'id' => 2,
                'email' => 'cliente@ejemplo.com',
                'password' => '$2y$12$.SpTG6FcaiMujPgN/Fk8lu6Q3IA2SqzLUnYRJL59ya2xS8guz01M.',
                'name' => 'Juan',
                'role' => 'USER',
                'phone' => '987654321',
                'ruc' => null,
                'createdAt' => '2026-02-23 17:10:37.903',
                'updatedAt' => '2026-02-23 19:17:05.390',
                'companyName' => 'Distribuidora Lima',
                'documentNumber' => '20123456789',
                'documentType' => 'RUC',
                'lastName' => 'Cliente',
                'isActive' => 1,
                'permissions' => null,
            ],
            [
                'id' => 3,
                'email' => 'dainer2607@gmail.com',
                'password' => '$2y$10$a1YMKmGt0p5S/0AomXGsTuuMssezjTnVGxsJ0MlGjROO7QnM7b3qm',
                'name' => 'Dainer',
                'role' => 'MANAGER',
                'phone' => '3242406307',
                'ruc' => null,
                'createdAt' => '2026-02-23 21:58:39.671',
                'updatedAt' => '2026-02-23 22:41:07.989',
                'companyName' => '',
                'documentNumber' => '1006713929',
                'documentType' => 'DNI',
                'lastName' => 'Vargas',
                'isActive' => 1,
                'permissions' => 'products,dashboard,categories,orders',
            ],
        ]);

        // 3. Products
        DB::table('product')->insert([
            ['id' => 1, 'name' => 'Bolígrafo Faber-Castell Trilux 035 Rojo', 'sku' => 'TMO-OFI-001', 'categoryId' => 'oficina', 'price' => 29.00, 'unit' => 'caja', 'stock' => 2000, 'stockStatus' => 'in-stock', 'image' => 'http://imagenes.tmo.com.pe/imagenes/utiles%20escolares/Lapiceros/Boligrafo%20faber%20castell%20trilux%20035%20%20Rojo.png', 'description' => 'Bolígrafo Faber-Castell Trilux 035 Rojo de alta calidad.', 'deliveryDays' => 1, 'brand' => 'Faber-Castell', 'minOrder' => 1, 'isRecurring' => 1, 'tags' => 'Oficina, Bolígrafo', 'isActive' => 1, 'createdAt' => '2026-02-23 16:59:09.141', 'updatedAt' => '2026-02-23 17:12:01.500', 'unitPrice' => null, 'unitPriceUnit' => null],
            ['id' => 2, 'name' => 'Bolígrafo Faber-Castell Trilux 035 Azul', 'sku' => 'TMO-OFI-002', 'categoryId' => 'oficina', 'price' => 29.00, 'unit' => 'caja', 'stock' => 1500, 'stockStatus' => 'in-stock', 'image' => 'http://imagenes.tmo.com.pe/imagenes/utiles%20escolares/Lapiceros/Boligrafo%20faber%20castell%20trilux%20035%20azul.png', 'description' => 'Bolígrafo Faber-Castell Trilux 035 Azul de alta calidad.', 'deliveryDays' => 1, 'brand' => 'Faber-Castell', 'minOrder' => 1, 'isRecurring' => 1, 'tags' => 'Oficina, Bolígrafo', 'isActive' => 1, 'createdAt' => '2026-02-23 16:59:09.148', 'updatedAt' => '2026-02-23 17:12:01.507', 'unitPrice' => null, 'unitPriceUnit' => null],
            ['id' => 3, 'name' => 'Papel Higiénico Family Pack', 'sku' => 'TMO-LIM-001', 'categoryId' => 'limpieza', 'price' => 124.00, 'unit' => 'pack', 'stock' => 600, 'stockStatus' => 'in-stock', 'image' => 'http://imagenes.tmo.com.pe/imagenes/limpieza/papel%20higienico/familiar/Papel%20higi%c3%a9nico%20Family%20pack,%20biodegradable.png', 'description' => 'Papel Higiénico Family Pack de alta calidad.', 'deliveryDays' => 1, 'brand' => 'TMO', 'minOrder' => 1, 'isRecurring' => 1, 'tags' => 'Limpieza, Papel', 'unitPrice' => 16.00, 'unitPriceUnit' => 'rollo', 'isActive' => 1, 'createdAt' => '2026-02-23 16:59:09.153', 'updatedAt' => '2026-02-23 17:12:01.548'],
            ['id' => 4, 'name' => 'Bolígrafo Faber-Castell Trilux 035 Negro', 'sku' => 'TMO-OFI-003', 'categoryId' => 'oficina', 'price' => 29.00, 'unit' => 'caja', 'stock' => 1800, 'stockStatus' => 'in-stock', 'image' => 'http://imagenes.tmo.com.pe/imagenes/utiles%20escolares/Lapiceros/Boligrafo%20faber%20castell%20trilux%20035%20negro.png', 'description' => 'Bolígrafo Faber-Castell Trilux 035 Negro de alta calidad.', 'deliveryDays' => 1, 'brand' => 'Faber-Castell', 'minOrder' => 1, 'isRecurring' => 0, 'tags' => 'Oficina, Bolígrafo', 'isActive' => 1, 'createdAt' => '2026-02-23 17:10:37.927', 'updatedAt' => '2026-02-23 17:12:01.512', 'unitPrice' => null, 'unitPriceUnit' => null],
            ['id' => 5, 'name' => 'Papel Fotocopia A4 75g Millennium', 'sku' => 'TMO-OFI-004', 'categoryId' => 'oficina', 'price' => 108.00, 'unit' => 'caja', 'stock' => 500, 'stockStatus' => 'in-stock', 'image' => 'http://imagenes.tmo.com.pe/imagenes/utiles%20escolares/hojas%20bond/Papel%20Fotocopia%20A4%2075%20G%20Milenium.png', 'description' => 'Papel Fotocopia A4 75g Millennium de alta calidad.', 'deliveryDays' => 1, 'brand' => 'Millennium', 'minOrder' => 1, 'isRecurring' => 0, 'tags' => 'Oficina, Papel, A4', 'unitPrice' => 11.80, 'unitPriceUnit' => 'pqte', 'isActive' => 1, 'createdAt' => '2026-02-23 17:10:37.934', 'updatedAt' => '2026-02-23 17:12:01.517'],
            ['id' => 6, 'name' => 'Sobre con Burbuja A-02 Kraft', 'sku' => 'TMO-EMP-001', 'categoryId' => 'empaque', 'price' => 50.00, 'unit' => 'pack', 'stock' => 300, 'stockStatus' => 'in-stock', 'image' => 'http://imagenes.tmo.com.pe/imagenes/empaque/burbujas/burbujas%20a2%20copia.png', 'description' => 'Sobre con Burbuja A-02 Kraft de alta calidad.', 'deliveryDays' => 1, 'brand' => 'Air Pad', 'minOrder' => 1, 'isRecurring' => 0, 'tags' => 'Empaque, Sobre', 'isActive' => 1, 'createdAt' => '2026-02-23 17:10:37.939', 'updatedAt' => '2026-02-23 17:12:01.532', 'unitPrice' => null, 'unitPriceUnit' => null],
            ['id' => 7, 'name' => 'Sabanilla Fibra Sintética 60cm x 100m', 'sku' => 'TMO-SAB-001', 'categoryId' => 'sabanillas', 'price' => 351.00, 'unit' => 'caja', 'stock' => 150, 'stockStatus' => 'in-stock', 'image' => 'http://imagenes.tmo.com.pe/imagenes/sabanillas/saban9lla%2060%20x100%20copia.jpg', 'description' => 'Sabanilla Fibra Sintética. Rollo de 60cm x 100m. Precortado cada 50cm.', 'deliveryDays' => 1, 'brand' => 'TMO', 'minOrder' => 1, 'isRecurring' => 0, 'tags' => 'Sabanillas, Fibra Sintética, Clínica, Spa, 60cm', 'unitPrice' => 59.00, 'unitPriceUnit' => 'rollo', 'isActive' => 1, 'createdAt' => '2026-02-23 17:10:37.951', 'updatedAt' => '2026-02-23 17:10:37.951'],
            ['id' => 8, 'name' => 'Café Altomayo Gourtmet 250g', 'sku' => 'TMO-CAF-001', 'categoryId' => 'cafeteria', 'price' => 15.50, 'unit' => 'unidad', 'stock' => 100, 'stockStatus' => 'in-stock', 'image' => 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400', 'description' => 'Café Altomayo Gourtmet 250g de alta calidad.', 'deliveryDays' => 1, 'brand' => 'Altomayo', 'minOrder' => 1, 'isRecurring' => 0, 'tags' => 'Cafetería, Alimentos', 'isActive' => 1, 'createdAt' => '2026-02-23 17:10:37.957', 'updatedAt' => '2026-02-23 17:12:01.570', 'unitPrice' => null, 'unitPriceUnit' => null],
            ['id' => 9, 'name' => 'Guantes de Nitrilo - Caja x 100', 'sku' => 'TMO-SEG-001', 'categoryId' => 'seguridad', 'price' => 45.00, 'unit' => 'caja', 'stock' => 300, 'stockStatus' => 'in-stock', 'image' => 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400', 'description' => 'Guantes de Nitrilo - Caja x 100 de alta calidad.', 'deliveryDays' => 1, 'brand' => 'Genérico', 'minOrder' => 1, 'isRecurring' => 0, 'tags' => 'Seguridad, EPP', 'isActive' => 1, 'createdAt' => '2026-02-23 17:10:37.962', 'updatedAt' => '2026-02-23 17:12:01.585', 'unitPrice' => null, 'unitPriceUnit' => null],
            ['id' => 10, 'name' => 'Engrapadora Standard Metálica', 'sku' => 'TMO-OFI-005', 'categoryId' => 'oficina', 'price' => 35.00, 'unit' => 'unidad', 'stock' => 100, 'stockStatus' => 'in-stock', 'image' => 'https://images.unsplash.com/photo-1590641151624-bca5477d9f78?q=80&w=400', 'description' => 'Engrapadora Standard Metálica de alta calidad.', 'deliveryDays' => 1, 'brand' => 'Standard', 'minOrder' => 1, 'isRecurring' => 0, 'tags' => 'Oficina, Escritorio', 'isActive' => 1, 'createdAt' => '2026-02-23 17:12:01.522', 'updatedAt' => '2026-02-23 17:12:01.522', 'unitPrice' => null, 'unitPriceUnit' => null],
            ['id' => 11, 'name' => 'Clips Metálicos 33mm - Caja x 100', 'sku' => 'TMO-OFI-006', 'categoryId' => 'oficina', 'price' => 4.50, 'unit' => 'caja', 'stock' => 1000, 'stockStatus' => 'in-stock', 'image' => 'https://images.unsplash.com/photo-1516962080544-eac695c93791?q=80&w=400', 'description' => 'Clips Metálicos 33mm - Caja x 100 de alta calidad.', 'deliveryDays' => 1, 'brand' => 'Genérico', 'minOrder' => 1, 'isRecurring' => 0, 'tags' => 'Oficina, Accesorios', 'isActive' => 1, 'createdAt' => '2026-02-23 17:12:01.527', 'updatedAt' => '2026-02-23 17:12:01.527', 'unitPrice' => null, 'unitPriceUnit' => null],
            ['id' => 12, 'name' => 'Cinta Embalaje Marrón 2x40yd', 'sku' => 'TMO-EMP-002', 'categoryId' => 'empaque', 'price' => 3.80, 'unit' => 'unidad', 'stock' => 1200, 'stockStatus' => 'in-stock', 'image' => 'http://localhost:3001/uploads/image-1771944675378-986208877.jpg', 'description' => 'Cinta Embalaje Marrón 2x40yd de alta calidad.', 'deliveryDays' => 1, 'brand' => 'Shurtape', 'minOrder' => 1, 'isRecurring' => 0, 'tags' => 'Empaque,Cinta', 'isActive' => 1, 'createdAt' => '2026-02-23 17:12:01.538', 'updatedAt' => '2026-02-23 17:12:01.538', 'unitPrice' => null, 'unitPriceUnit' => null],
            ['id' => 13, 'name' => 'Film Stretch 20\'\' x 1.5kg', 'sku' => 'TMO-EMP-003', 'categoryId' => 'empaque', 'price' => 28.00, 'unit' => 'rollo', 'stock' => 200, 'stockStatus' => 'in-stock', 'image' => 'https://images.unsplash.com/photo-1620455805821-74296bee0751?q=80&w=400', 'description' => 'Film Stretch 20\'\' x 1.5kg de alta calidad.', 'deliveryDays' => 1, 'brand' => 'TMO', 'minOrder' => 1, 'isRecurring' => 0, 'tags' => 'Empaque, Industrial', 'isActive' => 1, 'createdAt' => '2026-02-23 17:12:01.543', 'updatedAt' => '2026-02-23 17:12:01.543', 'unitPrice' => null, 'unitPriceUnit' => null],
            ['id' => 14, 'name' => 'Detergente Industrial 10kg', 'sku' => 'TMO-LIM-002', 'categoryId' => 'limpieza', 'price' => 85.00, 'unit' => 'saco', 'stock' => 150, 'stockStatus' => 'in-stock', 'image' => 'http://localhost:3001/uploads/image-1771944971587-801985210.jpg', 'description' => 'Detergente Industrial 10kg de alta calidad.', 'deliveryDays' => 1, 'brand' => 'Genérico', 'minOrder' => 1, 'isRecurring' => 0, 'tags' => 'Limpieza,Lavandería', 'isActive' => 1, 'createdAt' => '2026-02-23 17:12:01.559', 'updatedAt' => '2026-02-23 17:12:01.559', 'unitPrice' => null, 'unitPriceUnit' => null],
            ['id' => 15, 'name' => 'Jabón Líquido Lavanda 4L', 'sku' => 'TMO-LIM-003', 'categoryId' => 'limpieza', 'price' => 36.00, 'unit' => 'galón', 'stock' => 450, 'stockStatus' => 'in-stock', 'image' => 'http://imagenes.tmo.com.pe/imagenes/limpieza/jabones/Jab%c3%b3n%20liquido%20Hand%20Cleaning%20Lavanda.png', 'description' => 'Jabón Líquido Lavanda 4L de alta calidad.', 'deliveryDays' => 1, 'brand' => 'Hand Cleaning', 'minOrder' => 1, 'isRecurring' => 0, 'tags' => 'Limpieza, Baño', 'isActive' => 1, 'createdAt' => '2026-02-23 17:12:01.565', 'updatedAt' => '2026-02-23 17:12:01.565', 'unitPrice' => null, 'unitPriceUnit' => null],
            ['id' => 16, 'name' => 'Azúcar Rubia 1kg', 'sku' => 'TMO-CAF-002', 'categoryId' => 'cafeteria', 'price' => 4.20, 'unit' => 'unidad', 'stock' => 500, 'stockStatus' => 'in-stock', 'image' => 'http://localhost:3001/uploads/image-1771944442720-740429741.jpg', 'description' => 'Azúcar Rubia 1kg de alta calidad.', 'deliveryDays' => 1, 'brand' => 'Dulfina', 'minOrder' => 1, 'isRecurring' => 0, 'tags' => 'Cafetería,Alimentos', 'isActive' => 1, 'createdAt' => '2026-02-23 17:12:01.575', 'updatedAt' => '2026-02-23 17:12:01.575', 'unitPrice' => null, 'unitPriceUnit' => null],
            ['id' => 17, 'name' => 'Vaso de Tecnopor 8oz - Pack x 50', 'sku' => 'TMO-CAF-003', 'categoryId' => 'cafeteria', 'price' => 12.00, 'unit' => 'pack', 'stock' => 400, 'stockStatus' => 'in-stock', 'image' => 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400', 'description' => 'Vaso de Tecnopor 8oz - Pack x 50 de alta calidad.', 'deliveryDays' => 1, 'brand' => 'Genérico', 'minOrder' => 1, 'isRecurring' => 0, 'tags' => 'Cafetería, Descartables', 'isActive' => 1, 'createdAt' => '2026-02-23 17:12:01.580', 'updatedAt' => '2026-02-23 17:12:01.580', 'unitPrice' => null, 'unitPriceUnit' => null],
            ['id' => 18, 'name' => 'Mascarilla KN95 - Pack x 10', 'sku' => 'TMO-SEG-002', 'categoryId' => 'seguridad', 'price' => 1800.00, 'unit' => 'pack', 'stock' => 800, 'stockStatus' => 'in-stock', 'image' => 'https://images.unsplash.com/photo-1586942546304-48a0ffde3142?q=80&w=400', 'description' => 'Mascarilla KN95 - Pack x 10 de alta calidad.', 'deliveryDays' => 1, 'brand' => 'Genérico', 'minOrder' => 1, 'isRecurring' => 0, 'tags' => 'Seguridad,Protección', 'isActive' => 1, 'createdAt' => '2026-02-23 17:12:01.590', 'updatedAt' => '2026-02-23 17:12:01.590', 'unitPrice' => null, 'unitPriceUnit' => null],
            ['id' => 19, 'name' => 'Mouse Óptico USB Negro', 'sku' => 'TMO-TEC-001', 'categoryId' => 'tecnologia', 'price' => 25.00, 'unit' => 'unidad', 'stock' => 150, 'stockStatus' => 'in-stock', 'image' => 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=400', 'description' => 'Mouse Óptico USB Negro de alta calidad.', 'deliveryDays' => 1, 'brand' => 'Logitech', 'minOrder' => 1, 'isRecurring' => 0, 'tags' => 'Tecnología, Oficina', 'isActive' => 0, 'createdAt' => '2026-02-23 17:12:01.595', 'updatedAt' => '2026-02-23 17:12:01.595', 'unitPrice' => null, 'unitPriceUnit' => null],
            ['id' => 20, 'name' => 'Teclado Multimedia USB 2', 'sku' => 'TMO-TEC-002', 'categoryId' => 'tecnologia', 'price' => 4000.00, 'unit' => 'unidad', 'stock' => 50, 'stockStatus' => 'in-stock', 'image' => 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=400', 'description' => 'Teclado Multimedia USB de alta calidad.', 'deliveryDays' => 1, 'brand' => 'Genérico', 'minOrder' => 1, 'isRecurring' => 0, 'tags' => 'Tecnología,Oficina', 'isActive' => 0, 'createdAt' => '2026-02-23 17:12:01.600', 'updatedAt' => '2026-02-23 21:13:22.223', 'unitPrice' => null, 'unitPriceUnit' => null],
        ]);

        // 4. Orders
        DB::table('order')->insert([
            ['id' => 1, 'userId' => 2, 'total' => 87.00, 'status' => 'PENDING', 'createdAt' => '2026-02-23 17:10:37.970', 'updatedAt' => '2026-02-23 17:10:37.970'],
            ['id' => 2, 'userId' => 2, 'total' => 620.00, 'status' => 'PENDING', 'createdAt' => '2026-02-23 17:10:37.977', 'updatedAt' => '2026-02-23 17:10:37.977'],
            ['id' => 3, 'userId' => 2, 'total' => 15.50, 'status' => 'PENDING', 'createdAt' => '2026-02-23 17:12:01.607', 'updatedAt' => '2026-02-23 17:12:01.607'],
            ['id' => 4, 'userId' => 2, 'total' => 58.00, 'status' => 'PENDING', 'createdAt' => '2026-02-23 17:12:01.612', 'updatedAt' => '2026-02-23 17:12:01.612'],
            ['id' => 5, 'userId' => 2, 'total' => 12.60, 'status' => 'CONFIRMED', 'createdAt' => '2026-02-23 17:12:01.617', 'updatedAt' => '2026-02-23 17:12:01.617'],
            ['id' => 6, 'userId' => 2, 'total' => 48.00, 'status' => 'PENDING', 'createdAt' => '2026-02-23 17:12:01.621', 'updatedAt' => '2026-02-23 17:12:01.621'],
            ['id' => 7, 'userId' => 2, 'total' => 145.00, 'status' => 'SHIPPED', 'createdAt' => '2026-02-23 17:12:01.625', 'updatedAt' => '2026-02-23 19:17:40.412'],
        ]);

        // 5. OrderItems
        DB::table('orderitem')->insert([
            ['id' => 1, 'orderId' => 1, 'productId' => 1, 'quantity' => 2, 'price' => 29.00],
            ['id' => 2, 'orderId' => 1, 'productId' => 2, 'quantity' => 1, 'price' => 29.00],
            ['id' => 3, 'orderId' => 2, 'productId' => 3, 'quantity' => 5, 'price' => 124.00],
            ['id' => 4, 'orderId' => 3, 'productId' => 8, 'quantity' => 1, 'price' => 15.50],
            ['id' => 5, 'orderId' => 4, 'productId' => 2, 'quantity' => 2, 'price' => 29.00],
            ['id' => 6, 'orderId' => 5, 'productId' => 16, 'quantity' => 3, 'price' => 4.20],
            ['id' => 7, 'orderId' => 6, 'productId' => 17, 'quantity' => 4, 'price' => 12.00],
            ['id' => 8, 'orderId' => 7, 'productId' => 1, 'quantity' => 5, 'price' => 29.00],
        ]);

        // 6. Stock Movements
        DB::table('stockmovement')->insert([
            ['id' => 1, 'productId' => 20, 'quantity' => 1, 'type' => 'PURCHASE', 'reason' => 'Entrada manual', 'createdAt' => '2026-02-23 19:15:34.710'],
            ['id' => 2, 'productId' => 20, 'quantity' => -1, 'type' => 'SALE', 'reason' => 'Salida manual', 'createdAt' => '2026-02-23 19:15:37.944'],
            ['id' => 3, 'productId' => 20, 'quantity' => 1, 'type' => 'PURCHASE', 'reason' => 'Entrada manual', 'createdAt' => '2026-02-23 21:13:15.645'],
            ['id' => 4, 'productId' => 20, 'quantity' => 1, 'type' => 'PURCHASE', 'reason' => 'Entrada manual', 'createdAt' => '2026-02-23 21:13:16.368'],
            ['id' => 5, 'productId' => 20, 'quantity' => 1, 'type' => 'PURCHASE', 'reason' => 'Entrada manual', 'createdAt' => '2026-02-23 21:13:16.953'],
            ['id' => 6, 'productId' => 20, 'quantity' => 1, 'type' => 'PURCHASE', 'reason' => 'Entrada manual', 'createdAt' => '2026-02-23 21:13:17.636'],
            ['id' => 8, 'productId' => 20, 'quantity' => -1, 'type' => 'SALE', 'reason' => 'Salida manual', 'createdAt' => '2026-02-23 21:13:22.223'],
        ]);

        // 7. Audit Logs
        DB::table('auditlog')->insert([
            ['id' => 1, 'userId' => 1, 'action' => 'CREATE', 'entity' => 'Product', 'entityId' => '21', 'oldData' => null, 'newData' => '{"name":"dfgdf"}', 'createdAt' => '2026-02-23 18:55:04.837'],
            ['id' => 2, 'userId' => 1, 'action' => 'DELETE', 'entity' => 'Product', 'entityId' => '21', 'oldData' => '{"name":"dfgdf"}', 'newData' => '{"isActive":false}', 'createdAt' => '2026-02-23 18:55:15.224'],
        ]);

        // Re-enable foreign key checks
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
