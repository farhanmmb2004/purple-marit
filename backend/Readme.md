# SmileChat Backend API

## 📝 Description

SmileChat Backend is a comprehensive real-time customer support system built with Node.js, Express, and Socket.IO. It provides a robust foundation for AI-powered customer conversations, ticket management, and multi-role user authentication. The backend serves as the core engine powering the SmileChat SaaS platform, enabling businesses to deploy intelligent chatbots and manage customer interactions seamlessly.

## 🌟 Key Features

### **Authentication & User Management**
- JWT-based authentication system
- Role-based access control (Customer/Support)
- Secure user registration and login
- Token validation and refresh mechanisms

### **Real-Time Communication**
- Socket.IO integration for instant messaging
- Live typing indicators
- Online/offline user status tracking
- Real-time message delivery and read receipts

### **Ticket Management System**
- Dynamic ticket creation and management
- Status tracking (Open/In Progress/Closed)
- Role-based ticket access and operations
- Automated ticket assignment workflows

### **Multi-Role Support**
- **Customer Role**: Create tickets, chat with support agents
- **Support Role**: Handle multiple tickets, provide customer assistance
- Seamless role switching and permission management

### **Scalable Architecture**
- RESTful API design principles
- Modular middleware architecture
- Database-agnostic data layer
- Horizontal scaling ready

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (MongoDB/SQL) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌─────────────────┐
                       │   Socket.IO     │
                       │   (Real-time)   │
                       └─────────────────┘
```

## 🔌 API Endpoints

### **Authentication**
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User authentication
POST /api/auth/refresh     # Token refresh
POST /api/auth/logout      # User logout
```

### **User Management**
```
GET  /api/users/profile    # Get user profile
PUT  /api/users/profile    # Update user profile
GET  /api/users/status     # Get user status
```

### **Ticket Operations**
```
GET    /api/tickets        # Get user tickets
POST   /api/tickets        # Create new ticket
GET    /api/tickets/:id    # Get specific ticket
PUT    /api/tickets/:id    # Update ticket status
DELETE /api/tickets/:id    # Delete ticket
```

### **Messaging System**
```
GET  /api/messages/:ticketId    # Get ticket messages
POST /api/messages/:ticketId    # Send message
PUT  /api/messages/:id/read     # Mark message as read
```

## 🔄 Real-Time Events

### **Socket.IO Events**

**Client → Server:**
```javascript
'join_ticket'     // Join specific ticket room
'chat_message'    // Send chat message
'typing'          // Typing indicator
'message_read'    // Mark message as read
'user_status'     // Update user status
```

**Server → Client:**
```javascript
'chat_message'    // Receive new message
'user_status'     // User online/offline status
'online_users'    // List of online users
'typing'          // Someone is typing
'message_read'    // Message read confirmation
'ticket_updated'  // Ticket status changed
```

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Cross-origin resource sharing controls
- **Rate Limiting**: API request throttling
- **Input Validation**: Request data sanitization
- **Error Handling**: Comprehensive error management
- **SQL Injection Protection**: Parameterized queries

## 📊 Database Schema

### **Users Table**
```sql
- id (Primary Key)
- username (Unique)
- password (Hashed)
- role (customer/support)
- created_at
- updated_at
- last_active
```

### **Tickets Table**
```sql
- ticket_id (Primary Key)
- customer_id (Foreign Key)
- support_id (Foreign Key, Optional)
- status (open/in_progress/closed)
- priority (low/medium/high)
- created_at
- updated_at
```

### **Messages Table**
```sql
- message_id (Primary Key)
- ticket_id (Foreign Key)
- sender_id (Foreign Key)
- message_content
- is_read (Boolean)
- timestamp
```

## 🌐 Integration Capabilities

### **CDN Widget Integration**
The backend supports seamless integration with the SmileChat CDN widget:

```javascript
// Widget configuration
window.SmileChatConfig = {
    apiUrl: 'http://103.101.59.127:3100',
    apiKey: 'your-api-key',
    theme: { primaryColor: '#4CAF50' }
};
```

### **Multi-Platform Support**
- Web applications (React, Vue, Angular)
- Mobile applications (React Native, Flutter)
- WordPress plugins
- Shopify apps
- Custom integrations via REST API

## 🚀 Deployment Architecture

### **Production Environment**
```
Load Balancer (Nginx)
    │
    ├── App Server 1 (PM2)
    ├── App Server 2 (PM2)
    └── App Server N (PM2)
            │
            ▼
    Database Cluster (MongoDB/PostgreSQL)
            │
            ▼
    Redis Cache (Session Storage)
```

### **Microservices Ready**
The backend is architected to support microservices decomposition:
- Authentication Service
- Ticket Management Service
- Real-time Communication Service
- Notification Service
- Analytics Service

## 📈 Performance Optimizations

- **Connection Pooling**: Database connection optimization
- **Caching Strategy**: Redis-based caching for frequent queries
- **Message Queuing**: Background job processing
- **CDN Integration**: Static asset delivery optimization
- **Load Balancing**: Horizontal scaling support

## 🔍 Monitoring & Analytics

### **Built-in Metrics**
- API response times
- Active user connections
- Message throughput
- Ticket resolution rates
- Error rates and patterns

### **Integration Ready**
- Prometheus metrics export
- ELK stack logging
- New Relic APM support
- Datadog monitoring

## 🌍 Multi-Tenant Architecture

The backend supports multi-tenant deployment for SaaS operations:
- Isolated data per customer
- Custom branding support
- Per-tenant configuration
- Usage-based billing integration

## 🔧 Configuration Management

Environment-based configuration for:
- Database connections
- JWT secrets
- Socket.IO settings
- CORS policies
- Rate limiting rules
- Email/SMS providers

## 💡 Use Cases

Perfect for businesses requiring:
- **Customer Support Automation**
- **Real-time Customer Engagement**
- **Multi-agent Support Systems**
- **AI-powered Chatbot Integration**
- **Omnichannel Communication**
- **Enterprise Support Solutions**

The SmileChat backend provides the robust infrastructure needed to power modern customer communication platforms, from simple chatbots to complex enterprise support systems.