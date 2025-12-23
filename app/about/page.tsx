export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">About Pulsify</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Founded in 2023, Pulsify started with a simple mission: to bring premium products 
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
