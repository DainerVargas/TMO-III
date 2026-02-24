import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed starting...');

  // 1. Create Categories
  const categoriesData = [
    { id: 'oficina', name: 'Útiles de Oficina', icon: 'PenLine' },
    { id: 'empaque', name: 'Empaque y Embalaje', icon: 'Package' },
    { id: 'limpieza', name: 'Limpieza e Higiene', icon: 'Sparkles' },
    { id: 'sabanillas', name: 'Sabanillas', icon: 'ClipboardList' },
    { id: 'cafeteria', name: 'Cafetería y Alimentos', icon: 'Coffee' },
    { id: 'seguridad', name: 'Seguridad Industrial', icon: 'Shield' },
    { id: 'tecnologia', name: 'Tecnología y Accesorios', icon: 'Monitor' },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name, icon: cat.icon },
      create: cat,
    });
  }
  console.log('Categories seeded.');

  // 2. Create Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  // Admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tmo.com.pe' },
    update: {},
    create: {
      email: 'admin@tmo.com.pe',
      name: 'Admin',
      lastName: 'TMO',
      password: hashedPassword,
      role: 'ADMIN',
      phone: '999888777',
      companyName: 'TMO Suministros SAC',
    },
  });

  // Regular user
  const regularUser = await prisma.user.upsert({
    where: { email: 'cliente@ejemplo.com' },
    update: {},
    create: {
      email: 'cliente@ejemplo.com',
      name: 'Juan',
      lastName: 'Cliente',
      password: hashedPassword,
      role: 'USER',
      phone: '987654321',
      companyName: 'Distribuidora Lima',
      documentType: 'RUC',
      documentNumber: '20123456789',
    },
  });
  console.log('Users seeded.');

  // 3. Create Products
  const productsData = [
    // OFICINA
    { sku: "TMO-OFI-001", name: "Bolígrafo Faber-Castell Trilux 035 Rojo", categoryId: "oficina", price: 29.00, unit: "caja", stock: 2000, image: "http://imagenes.tmo.com.pe/imagenes/utiles%20escolares/Lapiceros/Boligrafo%20faber%20castell%20trilux%20035%20%20Rojo.png", brand: "Faber-Castell", tags: "Oficina, Bolígrafo" },
    { sku: "TMO-OFI-002", name: "Bolígrafo Faber-Castell Trilux 035 Azul", categoryId: "oficina", price: 29.00, unit: "caja", stock: 1500, image: "http://imagenes.tmo.com.pe/imagenes/utiles%20escolares/Lapiceros/Boligrafo%20faber%20castell%20trilux%20035%20azul.png", brand: "Faber-Castell", tags: "Oficina, Bolígrafo" },
    { sku: "TMO-OFI-003", name: "Bolígrafo Faber-Castell Trilux 035 Negro", categoryId: "oficina", price: 29.00, unit: "caja", stock: 1800, image: "http://imagenes.tmo.com.pe/imagenes/utiles%20escolares/Lapiceros/Boligrafo%20faber%20castell%20trilux%20035%20negro.png", brand: "Faber-Castell", tags: "Oficina, Bolígrafo" },
    { sku: "TMO-OFI-004", name: "Papel Fotocopia A4 75g Millennium", categoryId: "oficina", price: 108.00, unit: "caja", stock: 500, image: "http://imagenes.tmo.com.pe/imagenes/utiles%20escolares/hojas%20bond/Papel%20Fotocopia%20A4%2075%20G%20Milenium.png", brand: "Millennium", tags: "Oficina, Papel, A4", unitPrice: 11.80, unitPriceUnit: "pqte" },
    { sku: "TMO-OFI-005", name: "Engrapadora Standard Metálica", categoryId: "oficina", price: 35.00, unit: "unidad", stock: 100, image: "https://images.unsplash.com/photo-1590641151624-bca5477d9f78?q=80&w=400", brand: "Standard", tags: "Oficina, Escritorio" },
    { sku: "TMO-OFI-006", name: "Clips Metálicos 33mm - Caja x 100", categoryId: "oficina", price: 4.50, unit: "caja", stock: 1000, image: "https://images.unsplash.com/photo-1516962080544-eac695c93791?q=80&w=400", brand: "Genérico", tags: "Oficina, Accesorios" },

    // EMPAQUE
    { sku: "TMO-EMP-001", name: "Sobre con Burbuja A-02 Kraft", categoryId: "empaque", price: 50.00, unit: "pack", stock: 300, image: "http://imagenes.tmo.com.pe/imagenes/empaque/burbujas/burbujas%20a2%20copia.png", brand: "Air Pad", tags: "Empaque, Sobre" },
    { sku: "TMO-EMP-002", name: "Cinta Embalaje Marrón 2x40yd", categoryId: "empaque", price: 3.80, unit: "unidad", stock: 1200, image: "https://images.unsplash.com/photo-1595111022312-68393e8392ba?q=80&w=400", brand: "Shurtape", tags: "Empaque, Cinta" },
    { sku: "TMO-EMP-003", name: "Film Stretch 20'' x 1.5kg", categoryId: "empaque", price: 28.00, unit: "rollo", stock: 200, image: "https://images.unsplash.com/photo-1620455805821-74296bee0751?q=80&w=400", brand: "TMO", tags: "Empaque, Industrial" },

    // LIMPIEZA
    { sku: "TMO-LIM-001", name: "Papel Higiénico Family Pack", categoryId: "limpieza", price: 124.00, unit: "pack", stock: 600, image: "http://imagenes.tmo.com.pe/imagenes/limpieza/papel%20higienico/familiar/Papel%20higi%c3%a9nico%20Family%20pack,%20biodegradable.png", brand: "TMO", tags: "Limpieza, Papel" },
    { sku: "TMO-LIM-002", name: "Detergente Industrial 10kg", categoryId: "limpieza", price: 85.00, unit: "saco", stock: 150, image: "https://images.unsplash.com/photo-1584622781564-1d9876a13d00?q=80&w=400", brand: "Genérico", tags: "Limpieza, Lavandería" },
    { sku: "TMO-LIM-003", name: "Jabón Líquido Lavanda 4L", categoryId: "limpieza", price: 36.00, unit: "galón", stock: 450, image: "http://imagenes.tmo.com.pe/imagenes/limpieza/jabones/Jab%c3%b3n%20liquido%20Hand%20Cleaning%20Lavanda.png", brand: "Hand Cleaning", tags: "Limpieza, Baño" },

    // CAFETERIA
    { sku: "TMO-CAF-001", name: "Café Altomayo Gourtmet 250g", categoryId: "cafeteria", price: 15.50, unit: "unidad", stock: 100, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?q=80&w=400", brand: "Altomayo", tags: "Cafetería, Alimentos" },
    { sku: "TMO-CAF-002", name: "Azúcar Rubia 1kg", categoryId: "cafeteria", price: 4.20, unit: "unidad", stock: 500, image: "https://images.unsplash.com/photo-1581448670522-ee6327c9e7bc?q=80&w=400", brand: "Dulfina", tags: "Cafetería, Alimentos" },
    { sku: "TMO-CAF-003", name: "Vaso de Tecnopor 8oz - Pack x 50", categoryId: "cafeteria", price: 12.00, unit: "pack", stock: 400, image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=400", brand: "Genérico", tags: "Cafetería, Descartables" },

    // SEGURIDAD
    { sku: "TMO-SEG-001", name: "Guantes de Nitrilo - Caja x 100", categoryId: "seguridad", price: 45.00, unit: "caja", stock: 300, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400", brand: "Genérico", tags: "Seguridad, EPP" },
    { sku: "TMO-SEG-002", name: "Mascarilla KN95 - Pack x 10", categoryId: "seguridad", price: 18.00, unit: "pack", stock: 800, image: "https://images.unsplash.com/photo-1586942546304-48a0ffde3142?q=80&w=400", brand: "Genérico", tags: "Seguridad, Protección" },

    // TECNOLOGIA
    { sku: "TMO-TEC-001", name: "Mouse Óptico USB Negro", categoryId: "tecnologia", price: 25.00, unit: "unidad", stock: 150, image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=400", brand: "Logitech", tags: "Tecnología, Oficina" },
    { sku: "TMO-TEC-002", name: "Teclado Multimedia USB", categoryId: "tecnologia", price: 45.00, unit: "unidad", stock: 80, image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=400", brand: "Genérico", tags: "Tecnología, Oficina" },
  ];

  for (const prod of productsData) {
    const { ...data } = prod;
    await prisma.product.upsert({
      where: { sku: prod.sku },
      update: {
        ...data,
        description: data.name + " de alta calidad.",
        stockStatus: "in-stock"
      },
      create: {
        ...data,
        description: data.name + " de alta calidad.",
        stockStatus: "in-stock"
      },
    });
  }
  console.log('Products seeded.');

  // 4. Create Sample Orders
  const products = await prisma.product.findMany();
  for (let i = 0; i < 5; i++) {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    await prisma.order.create({
      data: {
        userId: regularUser.id,
        total: randomProduct.price.toNumber() * (i + 1),
        status: i % 2 === 0 ? 'CONFIRMED' : 'PENDING',
        items: {
          create: [
            { productId: randomProduct.id, quantity: i + 1, price: randomProduct.price },
          ]
        }
      }
    });
  }
  console.log('Sample orders seeded.');

  // 5. Create Global Settings
  const settingsData = [
    { key: 'SITE_NAME', value: 'TMO Suministros', description: 'Nombre del sitio web' },
    { key: 'N8N_WEBHOOK_URL', value: 'https://n8n.tmo.com.pe/webhook/test', description: 'URL para integraciones con n8n' },
    { key: 'SYSTEM_MAINTENANCE', value: 'false', description: 'Activar modo mantenimiento' },
    { key: 'LOW_STOCK_THRESHOLD', value: '10', description: 'Umbral para alertas de stock bajo' },
  ];

  for (const set of settingsData) {
    await prisma.globalSettings.upsert({
      where: { key: set.key },
      update: { value: set.value, description: set.description },
      create: set,
    });
  }
  console.log('Global settings seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
