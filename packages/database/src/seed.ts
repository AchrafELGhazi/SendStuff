
import { faker } from '@faker-js/faker';

import { prisma } from './client';

async function main() {
    console.log('🌱 Seeding database...');

    // Create admin user
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@sendstuff.com' },
        update: {},
        create: {
            email: 'admin@sendstuff.com',
            name: 'Admin User',
            role: 'ADMIN',
        },
    });

    console.log('👤 Created admin user:', adminUser.email);

    // Create subscribers
    const subscribers = await Promise.all(
        Array.from({ length: 100 }, async () => {
            const email = faker.internet.email();
            const name = faker.person.fullName();

            return prisma.subscriber.create({
                data: {
                    email,
                    name,
                    userId: adminUser.id,
                    tags: faker.helpers.arrayElements(['newsletter', 'marketing', 'product'], { min: 0, max: 3 }),
                    metadata: {
                        source: faker.helpers.arrayElement(['website', 'api', 'import']),
                        signupDate: faker.date.past(),
                    },
                },
            });
        })
    );

    console.log(`📧 Created ${subscribers.length} subscribers`);

    // Create campaigns
    const campaigns = await Promise.all(
        Array.from({ length: 10 }, async () => {
            return prisma.campaign.create({
                data: {
                    title: faker.company.catchPhrase(),
                    subject: faker.lorem.sentence(),
                    content: faker.lorem.paragraphs(3),
                    htmlContent: `<div>${faker.lorem.paragraphs(3, '<p>')}</p></div>`,
                    status: faker.helpers.arrayElement(['DRAFT', 'SENT', 'SCHEDULED']),
                    userId: adminUser.id,
                    scheduledAt: faker.helpers.maybe(() => faker.date.future(), { probability: 0.3 }),
                    sentAt: faker.helpers.maybe(() => faker.date.past(), { probability: 0.6 }),
                },
            });
        })
    );

    console.log(`📨 Created ${campaigns.length} campaigns`);

    console.log('✅ Database seeded successfully!');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });