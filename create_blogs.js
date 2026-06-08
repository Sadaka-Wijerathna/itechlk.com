const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const blog1 = await prisma.blog.create({
    data: {
      title: 'Top 5 AI Tools Every Creative Professional Needs in 2026',
      slug: 'top-5-ai-tools-creative-professionals-2026',
      content: '<p>Artificial Intelligence has completely transformed how creative professionals work. Instead of replacing creators, these tools are acting as powerful assistants that supercharge productivity and imagination.</p><h3>1. Midjourney v7</h3><p>The latest iteration of Midjourney offers unprecedented photorealism and control over generation. It’s perfect for concept art, storyboarding, and rapid prototyping of visual ideas.</p><h3>2. ChatGPT Plus</h3><p>Beyond text generation, the advanced reasoning capabilities make it an excellent brainstorming partner, copywriter, and coding assistant.</p><h3>3. Adobe Firefly</h3><p>Seamlessly integrated into Photoshop and Illustrator, Firefly allows for non-destructive editing and generative fill that respects your existing artwork’s style.</p><p>Embracing these tools will give you a significant edge in the fast-paced creative industry.</p>',
      image: '/assets/img/blog/blog-1.jpg',
      author: 'ITechLK Team',
      category: 'AI Tools',
      tags: ['AI', 'Creativity', 'Technology'],
      active: true,
    },
  });

  const blog2 = await prisma.blog.create({
    data: {
      title: 'Why Premium VPN Subscriptions are Essential for Remote Work',
      slug: 'why-premium-vpn-subscriptions-essential-remote-work',
      content: '<p>With remote work becoming the standard for many tech and digital professionals, securing your internet connection is no longer an option—it’s a necessity. Free VPNs often come with hidden costs, but premium subscriptions offer reliable protection.</p><h3>Data Privacy</h3><p>When working from cafes or co-working spaces, public Wi-Fi networks expose your sensitive work data to interception. A premium VPN encrypts your traffic with military-grade protocols.</p><h3>Unrestricted Access</h3><p>Remote workers often travel or deal with international clients. A VPN allows you to bypass geo-restrictions, access region-locked testing environments, and use services as if you were in your home country.</p><h3>Speed and Reliability</h3><p>Unlike free alternatives that throttle bandwidth, premium VPNs offer dedicated high-speed servers, ensuring uninterrupted video calls and fast file transfers.</p><p>Investing in a trusted VPN subscription is investing in your digital security and peace of mind.</p>',
      image: '/assets/img/blog/blog-2.jpg',
      author: 'Security Expert',
      category: 'Cybersecurity',
      tags: ['VPN', 'Remote Work', 'Security'],
      active: true,
    },
  });

  console.log('Created blogs:', { blog1: blog1.title, blog2: blog2.title });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
