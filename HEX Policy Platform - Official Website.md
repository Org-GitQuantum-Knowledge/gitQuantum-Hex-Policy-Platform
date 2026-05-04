# HEX Policy Platform - Official Website

A professional, fully-featured website for the HEX Policy Platform with documentation, interactive dashboard, and comprehensive guides.

## Website Structure

```
hex-policy-website/
├── index.html              # Landing page
├── dashboard.html          # Interactive benchmark dashboard
├── css/
│   ├── main.css           # Main styles
│   ├── dashboard.css      # Dashboard styles
│   └── docs.css           # Documentation styles
├── js/
│   ├── main.js            # Landing page scripts
│   ├── data.js            # Data management
│   ├── charts.js          # Chart.js integration
│   └── dashboard.js       # Dashboard logic
└── docs/
    ├── getting-started.html
    ├── api-reference.html
    ├── benchmarking.html
    └── examples.html
```

## Features

### Landing Page
- Professional hero section with call-to-action
- Feature highlights with icons
- Performance metrics display
- Architecture overview
- Documentation links
- Responsive design
- Smooth animations

### Interactive Dashboard
- Real-time benchmark execution
- 4 interactive Chart.js visualizations
- Performance metrics cards
- Results table with sorting
- Local storage persistence
- Responsive layout

### Documentation
- Getting Started guide
- Complete API reference
- Benchmarking guide
- Code examples
- Sidebar navigation
- Responsive documentation layout

### Design
- Dark theme optimized for technical content
- Gradient accents (blue to amber)
- Smooth transitions and animations
- Mobile-responsive design
- Professional typography
- Accessibility-focused

## Running Locally

### Prerequisites
- Python 3 (for local server)
- Modern web browser

### Start Local Server
```bash
cd hex-policy-website
python3 -m http.server 3000
```

Then visit: `http://localhost:3000`

## Website Pages

### Home Page (`index.html`)
- Landing page with hero section
- Feature showcase
- Performance metrics
- Architecture overview
- Call-to-action buttons
- Footer with links

### Dashboard (`dashboard.html`)
- Real-time benchmarking
- Interactive charts
- Performance metrics
- Results table
- Data persistence

### Documentation (`docs/`)
- **Getting Started**: Installation and quick start
- **API Reference**: Complete API documentation
- **Benchmarking Guide**: How to run and interpret benchmarks
- **Examples**: Code examples and use cases

## Styling

### Color Scheme
- **Primary**: #2563eb (Blue)
- **Secondary**: #f59e0b (Amber)
- **Background**: #0f172a (Dark Navy)
- **Surface**: #1e293b (Slate)
- **Text**: #f1f5f9 (Light)

### Typography
- **Font**: Inter (system font stack)
- **Monospace**: JetBrains Mono
- **Sizes**: Responsive with rem units

### Responsive Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## Features

### Navigation
- Sticky navigation bar
- Logo with gradient
- Quick links to sections
- Dashboard button
- Responsive mobile menu

### Interactive Elements
- Hover effects on cards
- Smooth scroll behavior
- Animated transitions
- Interactive charts
- Form controls

### Performance
- No build process required
- Pure HTML/CSS/JavaScript
- CDN-hosted Chart.js
- Local storage for data
- Optimized images

## Deployment

### Static Hosting
The website can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any web server (Apache, Nginx, etc.)

### Deployment Steps
1. Copy all files to hosting provider
2. Set index.html as default document
3. Configure HTTPS (recommended)
4. Set cache headers for static assets

### Environment Configuration
No environment variables or configuration needed. The website works out of the box.

## Browser Support
- Chrome/Chromium 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Customization

### Branding
Edit the following files to customize branding:
- `index.html`: Update title, meta tags, and content
- `css/main.css`: Modify color variables in `:root`
- `js/main.js`: Add custom scripts

### Content
- Update text in HTML files
- Modify styles in CSS files
- Add new pages by copying existing structure

### Colors
Edit CSS variables in `css/main.css`:
```css
:root {
    --primary: #2563eb;
    --secondary: #f59e0b;
    /* ... other variables ... */
}
```

## Performance Optimization

### Current Optimizations
- Minimal CSS (no frameworks)
- Vanilla JavaScript (no dependencies)
- CDN-hosted Chart.js
- Efficient animations using CSS transforms
- Local storage for data persistence

### Further Optimization
- Minify CSS/JavaScript
- Compress images
- Enable gzip compression
- Set cache headers
- Use CDN for assets

## Accessibility

### Features
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance
- Responsive design

### Testing
- Test with screen readers
- Verify keyboard navigation
- Check color contrast ratios
- Test on various devices

## Analytics

To add analytics, insert tracking code in `index.html` and `dashboard.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_ID');
</script>
```

## Support

For issues or questions:
1. Check the documentation at `/docs/`
2. Review code examples at `/docs/examples.html`
3. Try the interactive dashboard at `/dashboard.html`

## License

HEX Policy Platform - Open Source

## Credits

Created as part of the HEX Policy Platform project.
