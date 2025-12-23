#!/bin/bash
# Update the navigation in layout.tsx to include Products link
sed -i 's/<a href="#" className="font-medium hover:text-primary transition-colors">Products<\/a>/<a href="\/products" className="font-medium hover:text-primary transition-colors">Products<\/a>/' app/layout.tsx
echo "Updated navigation in layout.tsx"
