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
