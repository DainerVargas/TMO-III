const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true }
    });
    console.log(`Found ${products.length} products total.`);
    
    const activeProducts = products.filter(p => p.isActive);
    console.log(`Found ${activeProducts.length} active products.`);
    
    const categories = await prisma.category.findMany();
    console.log(`Found ${categories.length} categories.`);
    
    products.forEach(p => {
      console.log(`- ${p.name} (ID: ${p.id}, Category: ${p.categoryId}, Active: ${p.isActive})`);
    });
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
