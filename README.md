# Mall Rent-Payment Management System

A comprehensive mall management system built with Keystone.js, Next.js, and MySQL. This application helps track malls, stores, rent payments, and provides visual analytics through an admin dashboard.

## Features

- Mall and store management
- Rent payment tracking
- Client management
- Visual analytics dashboard
- User authentication
- GraphQL API

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Hnfgozel/KeystoneCMS.git
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following content:
```
DATABASE_URL=mysql://username:password@localhost:3306/mall_management
SHADOW_DATABASE_URL=mysql://username:password@localhost:3306/mall_management_shadow
SESSION_SECRET=your-secret-key-min-32-chars
```

Replace `username` and `password` with your MySQL credentials.

## Database Setup

### Option 1: Using the SQL File

1. Create the database:
```bash
mysql -u root -p
```

2. Inside MySQL console:
```sql
CREATE DATABASE mall_management;
```

3. Import the schema:
```bash
mysql -u root -p mall_management < mall_management.sql
```

### Option 2: Using Prisma (Recommended)

1. Generate and apply the database schema:
```bash
npx prisma generate
npx prisma db push
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Access the application:
- Admin UI: [http://localhost:3000](http://localhost:3000)
- GraphQL Playground: [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql)

## First-Time Setup

1. When you first access the Admin UI, you'll be prompted to create an admin user
2. Fill in the required details:
   - Name
   - Email
   - Password

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build the application
- `npm start` - Start production server

## Project Structure

```
├── admin/
│   ├── components/     # Custom admin UI components
│   └── pages/         # Custom admin pages
├── .keystone/         # Generated Keystone files
├── schema.ts          # Data model definitions
├── keystone.ts        # Keystone configuration
└── auth.ts           # Authentication configuration
```

## Customization

### Adding New Models

1. Add your model to `schema.ts`
2. Run `npm run dev` to regenerate the Prisma schema
3. Apply database changes using `npx prisma db push`

### Modifying the Dashboard

The custom dashboard is located in `admin/pages/custom-page.tsx`. You can modify this file to add or change visualizations.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the repository or contact the maintainers.
