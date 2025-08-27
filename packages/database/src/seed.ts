import { PrismaClient } from '@prisma/client'
import { UserRole, UserStatus, NewsletterStatus, SubscriberStatus, CampaignStatus, PlanType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting database seed...')

    // Create a demo super admin user
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@sendstuff.com' },
        update: {},
        create: {
            email: 'admin@sendstuff.com',
            firstName: 'Super',
            lastName: 'Admin',
            password: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj5w6r4OYDGe', // hashed "password123"
            status: UserStatus.ACTIVE,
            emailVerified: new Date(),
        },
    })

    // Create demo organization
    const organization = await prisma.organization.upsert({
        where: { slug: 'sendstuff-demo' },
        update: {},
        create: {
            name: 'SendStuff Demo',
            slug: 'sendstuff-demo',
            description: 'Demo organization for SendStuff platform',
            industry: 'Technology',
            country: 'United States',
            createdById: adminUser.id,
        },
    })

    // Add admin to organization
    await prisma.organizationMember.upsert({
        where: {
            userId_organizationId: {
                userId: adminUser.id,
                organizationId: organization.id,
            },
        },
        update: {},
        create: {
            userId: adminUser.id,
            organizationId: organization.id,
            role: UserRole.SUPER_ADMIN,
            joinedAt: new Date(),
        },
    })

    // Create demo billing plan
    await prisma.billingPlan.upsert({
        where: { organizationId: organization.id },
        update: {},
        create: {
            organizationId: organization.id,
            name: 'Professional',
            type: PlanType.PROFESSIONAL,
            monthlyPrice: 49.99,
            yearlyPrice: 499.99,
            subscriberLimit: 25000,
            emailLimit: 250000,
            features: ['Advanced Analytics', 'A/B Testing', 'Automation', 'Custom Templates'],
            isActive: true,
            trialDays: 14,
        },
    })

    // Create demo newsletter
    const newsletter = await prisma.newsletter.create({
        data: {
            name: 'Tech Weekly',
            slug: 'tech-weekly',
            description: 'Weekly newsletter about technology trends and insights',
            fromName: 'Tech Weekly Team',
            fromEmail: 'hello@techweekly.com',
            replyToEmail: 'support@techweekly.com',
            status: NewsletterStatus.ACTIVE,
            userId: adminUser.id,
            organizationId: organization.id,
            isPublic: true,
            settings: {
                allowComments: true,
                trackOpens: true,
                trackClicks: true,
                doubleOptIn: true,
            },
            brandingColors: {
                primary: '#10b981',
                secondary: '#1f2937',
                accent: '#f59e0b',
            },
        },
    })

    // Create demo subscribers
    const demoSubscribers = [
        {
            email: 'john.doe@example.com',
            firstName: 'John',
            lastName: 'Doe',
            country: 'United States',
            city: 'San Francisco',
            source: 'Website Signup',
        },
        {
            email: 'jane.smith@example.com',
            firstName: 'Jane',
            lastName: 'Smith',
            country: 'Canada',
            city: 'Toronto',
            source: 'Social Media',
        },
        {
            email: 'mike.johnson@example.com',
            firstName: 'Mike',
            lastName: 'Johnson',
            country: 'United Kingdom',
            city: 'London',
            source: 'Referral',
        },
        {
            email: 'sarah.williams@example.com',
            firstName: 'Sarah',
            lastName: 'Williams',
            country: 'Australia',
            city: 'Sydney',
            source: 'Content Download',
        },
        {
            email: 'david.brown@example.com',
            firstName: 'David',
            lastName: 'Brown',
            country: 'Germany',
            city: 'Berlin',
            source: 'Event Signup',
        },
    ]

    for (const subscriberData of demoSubscribers) {
        const subscriber = await prisma.subscriber.create({
            data: {
                ...subscriberData,
                organizationId: organization.id,
                customFields: {
                    interests: ['Technology', 'Startups'],
                    jobTitle: 'Software Developer',
                    company: `${subscriberData.firstName}'s Company`,
                },
                confirmedAt: new Date(),
            },
        })

        // Subscribe to newsletter
        await prisma.newsletterSubscriber.create({
            data: {
                newsletterId: newsletter.id,
                subscriberId: subscriber.id,
                status: SubscriberStatus.SUBSCRIBED,
                subscribedAt: new Date(),
                preferences: {
                    frequency: 'weekly',
                    format: 'html',
                    topics: ['tech-news', 'tutorials'],
                },
            },
        })
    }

    // Create demo segments
    const techSegment = await prisma.segment.create({
        data: {
            name: 'Tech Enthusiasts',
            description: 'Subscribers interested in technology and programming',
            type: 'DYNAMIC',
            color: '#10b981',
            rules: [
                {
                    field: 'customFields.interests',
                    operator: 'contains',
                    value: 'Technology',
                },
            ],
            newsletterId: newsletter.id,
            organizationId: organization.id,
        },
    })

    // Create demo email template
    const template = await prisma.template.create({
        data: {
            name: 'Weekly Newsletter Template',
            description: 'Standard template for weekly newsletters',
            category: 'NEWSLETTER',
            htmlContent: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>{{newsletter.name}}</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <header style="background: #10b981; color: white; padding: 20px; text-align: center;">
            <h1>{{newsletter.name}}</h1>
          </header>
          <main style="padding: 20px;">
            <h2>{{campaign.subject}}</h2>
            {{campaign.content}}
          </main>
          <footer style="background: #f3f4f6; padding: 20px; text-align: center; color: #6b7280;">
            <p>You're receiving this email because you subscribed to {{newsletter.name}}</p>
            <a href="{{unsubscribe_url}}">Unsubscribe</a>
          </footer>
        </body>
        </html>
      `,
            textContent: `
{{newsletter.name}}
{{campaign.subject}}
{{campaign.content}}

You're receiving this email because you subscribed to {{newsletter.name}}
Unsubscribe: {{unsubscribe_url}}
      `,
            variables: ['newsletter.name', 'campaign.subject', 'campaign.content', 'unsubscribe_url'],
            userId: adminUser.id,
            organizationId: organization.id,
            newsletterId: newsletter.id,
            isPublic: true,
        },
    })

    // Create demo campaign
    const campaign = await prisma.campaign.create({
        data: {
            name: 'Welcome to Tech Weekly #1',
            subject: '🚀 Welcome to Tech Weekly - Your dose of tech insights!',
            preheader: 'Get ready for amazing tech content delivered weekly',
            type: 'REGULAR',
            status: CampaignStatus.SENT,
            htmlContent: `
        <h2>Welcome to Tech Weekly!</h2>
        <p>We're excited to have you join our community of tech enthusiasts.</p>
        <h3>What to expect:</h3>
        <ul>
          <li>Weekly insights on latest tech trends</li>
          <li>Startup news and analysis</li>
          <li>Programming tutorials and tips</li>
          <li>Industry expert interviews</li>
        </ul>
        <p>Stay tuned for more amazing content!</p>
      `,
            textContent: `
Welcome to Tech Weekly!

We're excited to have you join our community of tech enthusiasts.

What to expect:
- Weekly insights on latest tech trends
- Startup news and analysis
- Programming tutorials and tips
- Industry expert interviews

Stay tuned for more amazing content!
      `,
            sentAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
            userId: adminUser.id,
            organizationId: organization.id,
            newsletterId: newsletter.id,
            templateId: template.id,
            settings: {
                trackOpens: true,
                trackClicks: true,
                timezone: 'UTC',
            },
        },
    })

    // Create campaign analytics
    await prisma.campaignAnalytics.create({
        data: {
            campaignId: campaign.id,
            totalSent: 5,
            totalDelivered: 5,
            totalOpened: 4,
            totalClicked: 2,
            totalUnsubscribed: 0,
            totalBounced: 0,
            totalSpamComplaints: 0,
            openRate: 80.0,
            clickRate: 40.0,
            bounceRate: 0.0,
            unsubscribeRate: 0.0,
            revenue: 0.0,
        },
    })

    // Create API key for admin
    await prisma.apiKey.create({
        data: {
            name: 'Demo API Key',
            key: 'sk_demo_1234567890abcdef',
            permissions: ['read:subscribers', 'write:subscribers', 'read:campaigns', 'write:campaigns'],
            userId: adminUser.id,
        },
    })

    console.log('✅ Database seeded successfully!')
    console.log('\n📧 Demo Data Created:')
    console.log(`- Organization: ${organization.name} (${organization.slug})`)
    console.log(`- Admin User: ${adminUser.email}`)
    console.log(`- Newsletter: ${newsletter.name} (${newsletter.slug})`)
    console.log(`- Subscribers: ${demoSubscribers.length}`)
    console.log(`- Template: ${template.name}`)
    console.log(`- Campaign: ${campaign.name}`)
    console.log(`- Segment: ${techSegment.name}`)
    console.log('\n🔑 Login credentials:')
    console.log('Email: admin@sendstuff.com')
    console.log('Password: password123')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error('❌ Seed failed:', e)
        await prisma.$disconnect()
        process.exit(1)
    })