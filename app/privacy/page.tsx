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
            This Privacy Policy describes how Pulsify ("we," "us," or "our") collects, uses, 
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
            <p><strong>Email:</strong> privacy@pulsify.com</p>
            <p><strong>Mail:</strong> Pulsify Privacy Team, 123 Commerce St, New York, NY 10001</p>
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
