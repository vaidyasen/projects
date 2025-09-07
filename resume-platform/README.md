# Resume Platform

A full-stack web application for creating, managing, and downloading professional resumes. Built with React, FastAPI, and Redis.

## Features

### MVP Features (Implemented)

- ✅ Secure user authentication (signup/login)
- ✅ Resume builder with comprehensive form fields
- ✅ Save multiple resume versions
- ✅ Dashboard to view, edit, and manage resumes
- ✅ Download resumes as PDF
- ✅ Responsive design with TailwindCSS

### Additional Features

- ✅ PDF generation with professional formatting
- ✅ Rich form validation and error handling
- ✅ Token-based authentication with JWT
- ✅ RESTful API design
- ✅ Docker containerization
- ✅ Clean, modern UI/UX

## Tech Stack

### Frontend

- **React 18** - Modern UI library with hooks
- **TailwindCSS** - Utility-first CSS framework for rapid styling
- **React Router** - Client-side routing
- **React Hook Form** - Performant forms with easy validation
- **Axios** - HTTP client for API communication
- **React Hot Toast** - Beautiful notifications

### Backend

- **FastAPI** - Modern, fast Python web framework
- **Redis** - In-memory data store for fast data access
- **JWT Authentication** - Secure token-based authentication
- **ReportLab** - PDF generation library
- **Pydantic** - Data validation using Python type annotations
- **Uvicorn** - ASGI server for running FastAPI

### Infrastructure

- **Docker & Docker Compose** - Containerization and orchestration
- **Redis** - Database and session storage

## Tech Stack Justification

### Why React?

- Component-based architecture for reusable UI elements
- Large ecosystem and community support
- Excellent developer experience with debugging tools
- Perfect for building interactive resume forms

### Why FastAPI?

- Automatic API documentation with OpenAPI/Swagger
- Built-in data validation with Pydantic
- High performance and async support
- Easy to test and maintain

### Why Redis?

- Fast in-memory storage perfect for user sessions
- Simple key-value operations ideal for resume data
- Built-in data structures (hashes, sets) for efficient queries
- Easy to scale and replicate

### Why TailwindCSS?

- Rapid prototyping with utility classes
- Consistent design system
- Responsive design out of the box
- Smaller bundle size compared to component libraries

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Redis
- Docker (optional)

### Option 1: Docker Setup (Recommended)

1. Clone the repository:

```bash
git clone <repository-url>
cd resume-platform
```

2. Run with Docker Compose:

```bash
docker-compose up --build
```

3. Access the application:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend Setup

```bash
cd backend
pip install -r requirements.txt
redis-server  # Start Redis in another terminal
python main.py
```

#### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## Demo Login

For evaluation purposes, use these demo credentials:

- **Email**: hire-me@anshumat.org
- **Password**: HireMe@2025!

This demo user is automatically created when the backend starts.

## API Endpoints

### Authentication

- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/me` - Get current user profile

### Resume Management

- `POST /resume` - Create new resume
- `GET /resume` - Get all user resumes
- `GET /resume/{id}` - Get specific resume
- `PUT /resume/{id}` - Update resume
- `DELETE /resume/{id}` - Delete resume
- `GET /resume/{id}/download` - Download resume as PDF

## Project Structure

```
resume-platform/
├── frontend/                 # React application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts (Auth)
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service layer
│   │   └── App.js           # Main app component
│   ├── package.json
│   └── Dockerfile
├── backend/                 # FastAPI application
│   ├── main.py             # FastAPI app and routes
│   ├── models.py           # Pydantic models
│   ├── database.py         # Redis operations
│   ├── pdf_generator.py    # PDF generation
│   ├── config.py           # Configuration
│   ├── requirements.txt
│   └── Dockerfile
├── docker-compose.yml       # Multi-container setup
└── README.md               # This file
```

## Key Features Implementation

### Authentication System

- JWT-based authentication with refresh tokens
- Password hashing using bcrypt
- Protected routes with automatic token refresh
- Session management with Redis

### Resume Builder

- Multi-step form with validation
- Dynamic field arrays for experience/education
- Auto-save functionality
- Rich text editing capabilities

### PDF Generation

- Professional resume templates
- Customizable formatting
- High-quality output suitable for printing
- Instant download functionality

### Data Management

- Efficient Redis data structures
- Optimized queries for fast retrieval
- Data validation at multiple layers
- Error handling and recovery

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- CORS protection
- Input validation and sanitization
- Error handling without exposing system details

## Performance Optimizations

- Redis for fast data access
- Efficient React rendering with keys
- Lazy loading of components
- Optimized Docker images
- CDN-ready static assets

## Development Approach

1. **API-First Design**: Designed the backend API before building the frontend
2. **Component Architecture**: Built reusable React components for scalability
3. **Validation Strategy**: Implemented validation at both frontend and backend
4. **Error Handling**: Comprehensive error handling with user-friendly messages
5. **Testing Ready**: Structure supports easy addition of unit and integration tests

## Production Considerations

### Environment Variables

Set these in production:

- `SECRET_KEY` - Strong secret key for JWT signing
- `REDIS_URL` - Production Redis connection string
- `REACT_APP_API_URL` - Production API URL

### Security Enhancements

- Use HTTPS in production
- Set up proper CORS origins
- Implement rate limiting
- Add request logging
- Set up monitoring and alerting

### Scaling Considerations

- Redis clustering for high availability
- Load balancer for multiple backend instances
- CDN for frontend assets
- Database backups and replication

## Future Enhancements

### Planned Features

- Multiple PDF templates
- Resume templates gallery
- Social sharing capabilities
- Export to different formats (Word, JSON)
- Resume analytics and tracking
- Team collaboration features

### Technical Improvements

- Unit and integration tests
- CI/CD pipeline
- Performance monitoring
- Automated backups
- Health checks and monitoring

## License

This project is built for educational and evaluation purposes.

## Support

For questions or issues, please refer to the API documentation at `/docs` when running the backend server.
