#!/bin/bash

echo "Creating all placeholder pages for ShopPro..."

# Create directories
mkdir -p app/{about,contact,faq,shipping,returns,privacy}

# 1. About Page
cat > app/about/page.tsx << 'EOF'
export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About ShopPro</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Founded in 2023, ShopPro started with a simple mission: to bring premium products 
              directly to consumers without the premium markup. What began as a small online store 
              has grown into a trusted destination for quality goods across multiple categories.
            </p>
            <p className="text-muted-foreground">
              We believe everyone deserves access to well-designed, durable products that make 
              everyday life better. That's why we carefully curate every item in our collection, 
              ensuring it meets our high standards for quality, functionality, and style.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg p-8">
            <h3 className="text-xl font-bold mb-4">Our Values</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary mr-3"></div>
                <span>Quality First - Never compromise on materials or craftsmanship</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary mr-3"></div>
                <span>Customer Focus - Your satisfaction is our priority</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary mr-3"></div>
                <span>Sustainable Practices - Ethical sourcing and minimal waste</span>
              </li>
              <li className="flex items-center">
                <div className="h-2 w-2 rounded-full bg-primary mr-3"></div>
                <span>Innovation - Constantly improving our products and services</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="text-center p-6 border rounded-lg">
            <div className="text-3xl font-bold text-primary mb-2">5000+</div>
            <div className="text-sm text-muted-foreground">Happy Customers</div>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <div className="text-3xl font-bold text-primary mb-2">200+</div>
            <div className="text-sm text-muted-foreground">Premium Products</div>
          </div>
          <div className="text-center p-6 border rounded-lg">
            <div className="text-3xl font-bold text-primary mb-2">24/7</div>
            <div className="text-sm text-muted-foreground">Customer Support</div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

echo "Created app/about/page.tsx"

# 2. Contact Page
cat > app/contact/page.tsx << 'EOF'
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "We'll get back to you within 24 hours.",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Contact Us</h1>
        <p className="text-muted-foreground mb-8">Get in touch with our team</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <div className="p-6 border rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Email</h3>
                  <p className="text-sm text-muted-foreground">support@shoppro.com</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                For general inquiries and support
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Phone</h3>
                  <p className="text-sm text-muted-foreground">1-800-SHOPPRO</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Mon-Fri 9am-6pm EST
              </p>
            </div>

            <div className="p-6 border rounded-lg">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Office</h3>
                  <p className="text-sm text-muted-foreground">123 Commerce St</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                New York, NY 10001
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="p-8 border rounded-lg">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full Name</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email Address</label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your inquiry..."
                    rows={6}
                    required
                  />
                </div>

                <Button type="submit" className="w-full md:w-auto">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

echo "Created app/contact/page.tsx"

# 3. FAQ Page
cat > app/faq/page.tsx << 'EOF'
"use client";

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const faqCategories = [
  {
    title: 'Orders & Shipping',
    questions: [
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping takes 3-5 business days. Express shipping is available for next-day delivery in most areas.'
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship to over 50 countries. International shipping typically takes 7-14 business days.'
      },
      {
        q: 'Can I track my order?',
        a: 'Yes, you\'ll receive a tracking number via email as soon as your order ships.'
      }
    ]
  },
  {
    title: 'Returns & Exchanges',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day return policy for unused items in original packaging with tags attached.'
      },
      {
        q: 'How do I start a return?',
        a: 'Visit the Returns page and enter your order number and email to begin the return process.'
      },
      {
        q: 'Are return shipping costs covered?',
        a: 'We provide free return shipping for defective items. For other returns, a small shipping fee may apply.'
      }
    ]
  },
  {
    title: 'Products & Quality',
    questions: [
      {
        q: 'What materials do you use?',
        a: 'We use premium, sustainable materials including organic cotton, recycled polyester, and responsibly sourced leather.'
      },
      {
        q: 'Are your products covered by warranty?',
        a: 'Most products come with a 1-year manufacturer warranty against defects.'
      },
      {
        q: 'Do you offer size guides?',
        a: 'Yes, detailed size guides are available on each product page under the "Size Guide" section.'
      }
    ]
  }
];

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(qa => 
      qa.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qa.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Frequently Asked Questions</h1>
        <p className="text-muted-foreground mb-8">Find answers to common questions</p>

        {/* Search */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for answers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12"
          />
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-8">
          {filteredFaqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
              <Accordion type="single" collapsible className="space-y-4">
                {category.questions.map((qa, qIndex) => (
                  <AccordionItem 
                    key={qIndex} 
                    value={`${categoryIndex}-${qIndex}`}
                    className="border rounded-lg px-6"
                  >
                    <AccordionTrigger className="text-left hover:no-underline py-4">
                      {qa.q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <p className="text-muted-foreground">{qa.a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-16 p-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Our customer support team is here to help.
          </p>
          <a href="/contact">
            <button className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:bg-primary/90 transition-colors">
              Contact Support
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
EOF

echo "Created app/faq/page.tsx"

# 4. Shipping Page
cat > app/shipping/page.tsx << 'EOF'
export default function ShippingPage() {
  const shippingOptions = [
    {
      name: 'Standard Shipping',
      price: '$4.99',
      time: '3-5 business days',
      features: ['Free on orders over $50', 'Tracking included', 'Signature required']
    },
    {
      name: 'Express Shipping',
      price: '$9.99',
      time: '1-2 business days',
      features: ['Priority processing', 'Real-time tracking', 'Delivery by 5 PM']
    },
    {
      name: 'Overnight Shipping',
      price: '$19.99',
      time: 'Next business day',
      features: ['Guaranteed delivery', 'Saturday delivery available', 'Insurance included']
    }
  ];

  const shippingDestinations = [
    { country: 'United States', time: '3-7 days', cost: '$4.99+' },
    { country: 'Canada', time: '5-10 days', cost: '$9.99+' },
    { country: 'United Kingdom', time: '7-14 days', cost: '$14.99+' },
    { country: 'Australia', time: '10-18 days', cost: '$19.99+' },
    { country: 'European Union', time: '7-12 days', cost: '$12.99+' },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Shipping Information</h1>
        <p className="text-muted-foreground mb-8">Everything you need to know about shipping</p>

        {/* Shipping Options */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Shipping Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shippingOptions.map((option, index) => (
              <div key={index} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2">{option.name}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold">{option.price}</span>
                    <span className="text-muted-foreground">• {option.time}</span>
                  </div>
                </div>
                <ul className="space-y-2 mb-6">
                  {option.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-center text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className="w-full py-2 border border-primary text-primary rounded-md hover:bg-primary/5 transition-colors">
                  Select Option
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* International Shipping */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-8">International Shipping</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4 font-medium">Destination</th>
                  <th className="text-left p-4 font-medium">Estimated Delivery</th>
                  <th className="text-left p-4 font-medium">Shipping Cost</th>
                </tr>
              </thead>
              <tbody>
                {shippingDestinations.map((dest, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-4">{dest.country}</td>
                    <td className="p-4">{dest.time}</td>
                    <td className="p-4">{dest.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipping FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-6">Shipping FAQ</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-2">When will my order ship?</h3>
                <p className="text-muted-foreground">
                  Most orders ship within 24 hours of placement. Orders placed after 2 PM EST ship the next business day.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Can I change my shipping address?</h3>
                <p className="text-muted-foreground">
                  Address changes are only possible before your order ships. Contact our support team immediately if you need to update your address.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Do you ship to PO boxes?</h3>
                <p className="text-muted-foreground">
                  Yes, we ship to PO boxes via standard shipping. Express and overnight shipping require a physical address.
                </p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-6">Important Notes</h2>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h3 className="font-bold text-yellow-800 mb-1">Delivery Delays</h3>
                <p className="text-yellow-700 text-sm">
                  During holidays and peak seasons, delivery times may be extended by 2-3 business days.
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-bold text-blue-800 mb-1">Customs & Duties</h3>
                <p className="text-blue-700 text-sm">
                  International customers are responsible for any customs duties, taxes, or fees imposed by their country.
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-bold text-green-800 mb-1">Tracking Updates</h3>
                <p className="text-green-700 text-sm">
                  Tracking numbers are emailed within 2 hours of shipment. Updates may take 24 hours to appear in the carrier's system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

echo "Created app/shipping/page.tsx"

# 5. Returns Page
cat > app/returns/page.tsx << 'EOF'
"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ReturnsPage() {
  const { toast } = useToast();
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleStartReturn = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderNumber && email) {
      toast({
        title: "Return Started",
        description: "We've sent return instructions to your email.",
      });
      setOrderNumber('');
      setEmail('');
    }
  };

  const returnPolicy = [
    {
      icon: CheckCircle,
      title: '30-Day Return Window',
      description: 'Items must be returned within 30 days of delivery'
    },
    {
      icon: XCircle,
      title: 'Condition Requirements',
      description: 'Items must be unused with original packaging and tags'
    },
    {
      icon: Clock,
      title: 'Refund Processing',
      description: 'Refunds processed within 5-10 business days of receipt'
    }
  ];

  const returnSteps = [
    'Start return online',
    'Print return label',
    'Package items securely',
    'Drop off at carrier',
    'Receive refund'
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Returns & Exchanges</h1>
        <p className="text-muted-foreground mb-8">Easy returns for a hassle-free experience</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Policy Highlights */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Return Policy</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {returnPolicy.map((item, index) => {
                const Icon = item.icon;
                return (
                  <div key={index} className="border rounded-lg p-6">
                    <Icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-bold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                );
              })}
            </div>

            {/* Return Process Steps */}
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Return Process</h3>
              <div className="relative">
                <div className="absolute left-0 top-1/2 h-0.5 w-full bg-muted -translate-y-1/2"></div>
                <div className="grid grid-cols-5 relative z-10">
                  {returnSteps.map((step, index) => (
                    <div key={index} className="text-center">
                      <div className="h-10 w-10 rounded-full bg-background border-4 border-background mx-auto mb-2 flex items-center justify-center">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <p className="text-sm font-medium">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Start Return Form */}
          <div>
            <div className="border rounded-lg p-6 sticky top-6">
              <h2 className="text-xl font-bold mb-4">Start a Return</h2>
              <form onSubmit={handleStartReturn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Order Number</label>
                  <Input
                    placeholder="e.g., ORD-123456"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Start Return
                </Button>
              </form>
              
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-bold mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Contact our returns team for assistance with your return.
                </p>
                <a href="/contact">
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="border rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Common Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold mb-2">How long does it take to receive my refund?</h3>
              <p className="text-muted-foreground">
                Refunds are typically processed within 5-10 business days after we receive your return. The time it takes for the refund to appear in your account depends on your payment method.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">What items cannot be returned?</h3>
              <p className="text-muted-foreground">
                Personalized items, intimate apparel, and final sale items marked as "non-returnable" cannot be returned. Please check product descriptions before purchasing.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Do I need to pay for return shipping?</h3>
              <p className="text-muted-foreground">
                Return shipping is free for defective or incorrect items. For other returns, a $6.99 return shipping fee will be deducted from your refund.
              </p>
            </div>
            <div>
              <h3 className="font-bold mb-2">Can I exchange an item?</h3>
              <p className="text-muted-foreground">
                Yes, you can request an exchange during the return process. If the exchange item has a different price, we'll process the difference accordingly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
EOF

echo "Created app/returns/page.tsx"

# 6. Privacy Policy Page
cat > app/privacy/page.tsx << 'EOF'
export default function PrivacyPage() {
  const privacySections = [
    {
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us. This includes:
      • Personal details: name, email address, phone number
      • Payment information: credit card details, billing address
      • Transaction history: purchases, returns, preferences
      • Communications: emails, chat logs, feedback`
    },
    {
      title: 'How We Use Your Information',
      content: `We use the information we collect to:
      • Process and fulfill your orders
      • Communicate with you about orders, products, and promotions
      • Improve our website, products, and services
      • Detect and prevent fraud and security issues
      • Comply with legal obligations`
    },
    {
      title: 'Information Sharing',
      content: `We do not sell your personal information. We may share information with:
      • Service providers who help us operate our business (payment processors, shipping carriers)
      • Legal authorities when required by law or to protect our rights
      • Business partners in connection with a merger, acquisition, or sale of assets
      All third parties are contractually obligated to protect your data.`
    },
    {
      title: 'Cookies & Tracking',
      content: `We use cookies and similar technologies to:
      • Remember your preferences and settings
      • Analyze website traffic and usage patterns
      • Deliver personalized content and advertisements
      • Enhance security and prevent fraud
      You can control cookies through your browser settings, but some features may not function properly.`
    },
    {
      title: 'Data Security',
      content: `We implement appropriate technical and organizational measures to protect your personal data, including:
      • Encryption of sensitive data in transit and at rest
      • Regular security assessments and vulnerability testing
      • Access controls and authentication measures
      • Employee training on data protection
      However, no method of transmission over the Internet is 100% secure.`
    },
    {
      title: 'Your Rights',
      content: `Depending on your location, you may have the right to:
      • Access, correct, or delete your personal information
      • Restrict or object to processing of your data
      • Data portability (receive your data in a structured format)
      • Withdraw consent at any time
      To exercise these rights, contact us using the information below.`
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground mb-8">
          Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>

        <div className="mb-8 p-6 bg-muted rounded-lg">
          <p className="mb-4">
            This Privacy Policy describes how ShopPro ("we," "us," or "our") collects, uses, 
            and shares your personal information when you use our website and services.
          </p>
          <p>
            By using our services, you agree to the collection and use of information in 
            accordance with this policy.
          </p>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-8">
          {privacySections.map((section, index) => (
            <div key={index} className="border-b pb-8">
              <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
              <div className="text-muted-foreground whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="mt-12 p-8 border rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            If you have questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="space-y-2">
            <p><strong>Email:</strong> privacy@shoppro.com</p>
            <p><strong>Mail:</strong> ShopPro Privacy Team, 123 Commerce St, New York, NY 10001</p>
            <p><strong>Phone:</strong> 1-800-SHOPPRO (ext. 2 for privacy inquiries)</p>
          </div>
        </div>

        {/* Policy Updates */}
        <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-2">Policy Updates</h3>
          <p className="text-blue-700">
            We may update this Privacy Policy from time to time. We will notify you of any changes 
            by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>
        </div>
      </div>
    </div>
  );
}
EOF

echo "Created app/privacy/page.tsx"

echo ""
echo "✅ All 6 pages created successfully!"
echo ""
echo "📁 Pages created:"
echo "  1. /about - Company information page"
echo "  2. /contact - Contact form with interactive form"
echo "  3. /faq - Searchable FAQ with accordion"
echo "  4. /shipping - Shipping options and information"
echo "  5. /returns - Return process with interactive form"
echo "  6. /privacy - Privacy policy page"
echo ""
echo "🚀 Features included:"
echo "  • Interactive forms (Contact, Returns)"
echo "  • Searchable FAQ with filtering"
echo "  • Shipping options comparison table"
echo "  • Return process step-by-step visualization"
echo "  • Privacy policy with clear sections"
echo "  • Responsive design for all devices"
echo "  • Toast notifications for form submissions"
echo "  • Consistent styling with your existing UI"
echo ""
echo "Your navigation menu will now work perfectly with these pages!"