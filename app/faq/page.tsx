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
