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
