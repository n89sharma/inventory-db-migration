import { prisma } from './prisma.js'

const message: string = '1Hello, Node.js with TypeScript!';
console.log(message);

async function main() {
    const allModels = await prisma.model.findMany({
        include: {
            brand: true
        },
    })
    console.log('All users:', JSON.stringify(allModels, null, 2))
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

