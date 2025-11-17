# Sai Seva Samiti Website

A modern, full-stack charitable organization website built with Next.js, featuring a public-facing website and a comprehensive admin panel for content management.

## Overview

Sai Seva Samiti is a non-profit organization dedicated to serving humanity through food distribution, medical assistance, and awareness campaigns. This website serves as the digital presence for the organization, enabling public engagement and efficient administrative management.

## Features

### Public Website
- **Home Page**: Dynamic hero section with organization statistics, services showcase, mission & vision, and team highlights
- **About Us**: Detailed information about the organization and its team members
- **Campaigns**: Browse and view detailed information about ongoing and past campaigns
- **Gallery**: Visual showcase of the organization's activities and events
- **Certificates**: Display of awards and certifications received by the organization
- **Contact Us**: Contact form for inquiries and engagement
- **Donate**: Donation page to support the organization's initiatives
- **Newsletter Subscription**: Allow visitors to subscribe to updates

### Admin Panel
Comprehensive content management system with the following modules:
- **Dashboard**: Overview of key metrics and recent activities
- **Users Management**: Manage admin users and access control
- **Members Management**: Add, edit, and manage organization members
- **Volunteers Management**: Track and manage volunteer information
- **Campaigns Management**: Create and manage campaigns with images and descriptions
- **Gallery Management**: Upload and organize photos with categories
- **Certificates Management**: Manage awards and certifications
- **Activities Number**: Update statistics (happy people, offices, staff, volunteers)
- **Contact Submissions**: View and manage contact form submissions
- **Donators Management**: Track and manage donor information
- **Newsletter Management**: View and manage newsletter subscribers

### Additional Features
- **Responsive Design**: Fully responsive across all devices
- **Dark Mode Support**: Built-in theme toggle for light/dark modes
- **Animations**: Smooth animations using Framer Motion
- **Image Optimization**: Automatic image compression and optimization
- **SEO Friendly**: Optimized for search engines
- **Type-Safe**: Full TypeScript implementation
- **Authentication**: Secure JWT-based authentication system
- **Database**: MongoDB integration with Mongoose ODM

## Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS v4** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **shadcn/ui** - Re-usable UI components built on Radix UI
- **Lucide React** - Icon library
- **next-themes** - Theme management

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **browser-image-compression** - Client-side image compression

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **TypeScript** - Static type checking

## Project Structure

```
sai_seva_samiti_website/
├── app/                          # Next.js App Router
│   ├── (client)/                 # Client-facing pages (grouped route)
│   │   ├── about-us/
│   │   ├── campaigns/
│   │   ├── certificates/
│   │   ├── contact-us/
│   │   ├── donate/
│   │   └── gallery/
│   ├── admin/                    # Admin panel pages
│   │   ├── activities-number/
│   │   ├── campaigns/
│   │   ├── certificates/
│   │   ├── contact-us/
│   │   ├── donators/
│   │   ├── gallery/
│   │   ├── members/
│   │   ├── newsletter/
│   │   ├── users/
│   │   ├── volunteers/
│   │   ├── AdminNav.tsx
│   │   └── layout.tsx
│   ├── login/                    # Authentication
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── animations/               # Animation components
│   │   ├── FadeIn.tsx
│   │   ├── ScaleIn.tsx
│   │   ├── SlideIn.tsx
│   │   └── StaggerContainer.tsx
│   ├── layout/                   # Layout components
│   │   ├── ConditionalLayout.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── ParallaxHero.tsx
│   │   └── Section.tsx
│   ├── ui/                       # shadcn/ui components
│   ├── theme-provider.tsx
│   └── theme-toggle.tsx
├── lib/                          # Utility functions
│   ├── dbConnect.ts              # MongoDB connection
│   ├── imageUtils.ts             # Image processing utilities
│   └── utils.ts                  # General utilities
├── models/                       # Mongoose models
│   ├── ActivitiesNumber.ts
│   ├── Campaigns.ts
│   ├── Certificates.ts
│   ├── ContactUs.ts
│   ├── Donators.ts
│   ├── Gallery.ts
│   ├── Members.ts
│   ├── NewsLetter.ts
│   ├── Users.ts
│   └── Volunteers.ts
├── public/                       # Static assets
│   └── images/                   # Image files
├── .env.local                    # Environment variables (create this)
├── components.json               # shadcn/ui configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind configuration
└── tsconfig.json                 # TypeScript configuration
```

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 20.x or higher
- **npm** or **yarn** or **pnpm** or **bun**
- **MongoDB** (local installation or MongoDB Atlas account)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sai_seva_samiti_website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory with the following variables:
   ```env
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/sai_seva_samiti
   # or for MongoDB Atlas:
   # MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sai_seva_samiti

   # JWT Secret (use a strong random string)
   JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production

   # Next.js
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Set up the database**

   Ensure MongoDB is running locally, or you have access to a MongoDB Atlas cluster. The application will automatically create the necessary collections on first use.

## Running the Application

### Development Mode
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

### Production Build
```bash
# Build the application
npm run build

# Start the production server
npm run start
```

### Linting
```bash
npm run lint
```

## Admin Panel Access

To access the admin panel:

1. Navigate to `/login`
2. Use admin credentials (you'll need to create an admin user in the database first)
3. After successful login, you'll be redirected to `/admin`

### Creating the First Admin User

You can create an admin user by directly inserting into MongoDB:

```javascript
// Connect to your MongoDB and run this in the MongoDB shell or Compass
db.users.insertOne({
  username: "admin",
  email: "admin@saiseva.org",
  password: "$2a$10$YourHashedPasswordHere", // Use bcrypt to hash your password
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

Or create a temporary signup route in your application to create the first user.

## Database Models

The application uses the following MongoDB collections:

- **users** - Admin user accounts
- **members** - Organization members and team information
- **volunteers** - Volunteer information and details
- **campaigns** - Campaign data with images and descriptions
- **gallery** - Photo gallery with categories
- **certificates** - Awards and certifications
- **activitiesnumbers** - Statistics for the homepage
- **contactus** - Contact form submissions
- **donators** - Donor information and records
- **newsletters** - Newsletter subscriber emails

## Key Features Explained

### Image Handling
- Images are automatically compressed on the client-side before upload
- Supports various image formats (JPEG, PNG, WebP)
- Optimized delivery using Next.js Image component

### Authentication Flow
- JWT-based authentication
- Secure password hashing with bcrypt
- Protected routes for admin panel
- Session management

### Theme Support
- Light and dark mode support
- Persistent theme preference
- Smooth theme transitions

### Animations
- Custom animation components using Framer Motion
- FadeIn, SlideIn, ScaleIn effects
- Stagger animations for lists and grids
- Parallax scrolling effects

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `MONGODB_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |
| `NEXT_PUBLIC_BASE_URL` | Base URL of the application | No | http://localhost:3000 |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary to Sai Seva Samiti organization.

## Support

For support, please contact the development team or open an issue in the repository.

---

**Note**: This is a production application for Sai Seva Samiti. Please ensure proper security measures are in place before deploying to production, including:
- Strong JWT secrets
- Secure MongoDB credentials
- HTTPS configuration
- Rate limiting
- Input validation and sanitization
- Regular security audits
