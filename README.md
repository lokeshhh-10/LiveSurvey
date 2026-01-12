# 📊 Survey & Feedback Application

A full-stack **Survey / Feedback Application** built using the **MERN stack** with a clean **MVC architecture**, **JWT authentication**, **real-time response tracking using Socket.io**, and **data visualization using Chart.js**.

## 🧩 Tech Stack

### Frontend
- **React** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Chart.js** - Data visualization
- **Socket.io Client** - Real-time updates
- **Axios** - HTTP client
- **React Router** - Routing

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (with Mongoose)
- **Socket.io** - Real-time communication
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 🏗️ Architecture

This project follows the **MVC (Model–View–Controller)** pattern:
- **Model** → MongoDB schemas
- **View** → React UI components
- **Controller** → Express business logic
- **Realtime Layer** → Socket.io
- **Analytics Layer** → Chart.js

## ✨ Features

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes
- Secure password hashing

### Survey Management
- Create surveys with dynamic questions
- Support for Multiple Choice (MCQ) and Short Answer (Text) questions
- View all your surveys in a beautiful card layout
- Shareable survey links for public access

### Real-Time Analytics
- Live response count updates
- Real-time analytics dashboard
- Multi-user synchronization
- Visual charts (Pie & Bar charts) for MCQ questions
- Text response viewer for short answers

### User Experience
- Professional and modern UI with Tailwind CSS
- Responsive design
- Intuitive navigation
- Copy shareable links with one click

## 📁 Project Structure

```
Survey App/
├── server/                 # Backend
│   ├── src/
│   │   ├── config/         # Database & Socket configuration
│   │   ├── models/         # MongoDB schemas
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth middleware
│   │   ├── services/      # JWT & Analytics services
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   └── package.json
│
└── client/                 # Frontend
    ├── src/
    │   ├── api/            # Axios configuration
    │   ├── services/       # API service functions
    │   ├── context/        # Auth context
    │   ├── pages/          # Page components
    │   ├── App.jsx         # Main app component
    │   └── main.jsx        # Entry point
    └── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Survey App"
   ```

2. **Set up the Backend**
   ```bash
   cd server
   npm install
   ```

3. **Configure Environment Variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/survey_app
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   CLIENT_URL=http://localhost:5173
   ```

4. **Set up the Frontend**
   ```bash
   cd ../client
   npm install
   ```

5. **Configure Frontend Environment (Optional)**
   
   Create a `.env` file in the `client` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start MongoDB**
   - Make sure MongoDB is running on your system
   - Or use MongoDB Atlas and update the `MONGO_URI` in `.env`

2. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   ```
   The server will run on `http://localhost:5000`

3. **Start the Frontend Development Server**
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173`

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📖 How to Use

### 1. Register/Login
- Click on "Register" to create a new account
- Or "Login" if you already have an account
- Fill in your details and submit

### 2. Create a Survey
- After logging in, you'll see your dashboard
- Click "Create Survey" button
- Enter survey title and description (optional)
- Add questions:
  - Select question type (Multiple Choice or Short Answer)
  - Enter the question text
  - For MCQ: Add at least 2 options
  - For Text: No options needed
- Click "Create Survey" when done

### 3. View Your Surveys
- All your surveys are displayed as cards on the dashboard
- Each card shows the survey title, description, and creation date
- Click "View Analytics" to see real-time analytics

### 4. Share Your Survey
- Go to the Analytics page for any survey
- Click "Copy Shareable Link" button
- Share the link with others
- Anyone with the link can fill out the survey

### 5. View Real-Time Analytics
- Click "View Analytics" on any survey card
- See total response count
- For MCQ questions: View Pie and Bar charts
- For Text questions: View all text responses
- Analytics update in real-time when new responses are submitted

### 6. Take a Survey
- Use the shareable link to access a survey
- Answer all questions
- Submit your response
- The analytics will update in real-time for the survey creator

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Surveys
- `POST /api/surveys` - Create a new survey (Protected)
- `GET /api/surveys` - Get all surveys for logged-in user (Protected)
- `GET /api/surveys/:id` - Get survey by ID
- `GET /api/surveys/link/:link` - Get survey by shareable link

### Responses
- `POST /api/responses` - Submit a survey response

### Analytics
- `GET /api/analytics/:surveyId` - Get analytics for a survey (Protected)

## 🔐 Authentication

- JWT tokens are stored in localStorage
- Tokens are automatically included in API requests
- Protected routes require authentication
- Tokens expire after 7 days

## ⚡ Real-Time Features

- When a response is submitted, all connected analytics dashboards update automatically
- Uses Socket.io for real-time communication
- No page refresh needed to see new responses

## 🎨 UI/UX Features

- Modern gradient designs
- Smooth transitions and hover effects
- Responsive layout for all screen sizes
- Clean and intuitive interface
- Professional color scheme

## 🛠️ Development

### Backend Scripts
- `npm run dev` - Start development server with auto-reload
- `npm start` - Start production server

### Frontend Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 📝 Notes

- The application prevents duplicate responses using user identifiers
- Surveys are automatically published when created
- All surveys have unique shareable links
- Real-time updates work across multiple browser tabs/windows

## 🐛 Troubleshooting

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check your `MONGO_URI` in `.env`

2. **Port Already in Use**
   - Change the `PORT` in server `.env`
   - Update `VITE_API_URL` in client `.env` accordingly

3. **Socket.io Connection Issues**
   - Ensure backend server is running
   - Check CORS settings in `server/src/app.js`

4. **Authentication Issues**
   - Clear localStorage and try logging in again
   - Check JWT_SECRET in server `.env`

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Built with ❤️ using MERN stack

---

**Happy Surveying!** 🎉

