# Bank_Transaction_System
| Project Overview |

This project is a backend system built using Node.js and modern libraries to handle authentication, transactions, and secure communication. It focuses on reliability, security, and clean architecture.

<img width="233" height="407" alt="image" src="https://github.com/user-attachments/assets/513778d8-ae8d-4c4a-add7-dd33dfa2e36a" />

# Tech Stack & Dependencies

## Authentication & Security

### **bcrypt**

Used for hashing passwords before storing them in the database.
* Prevents storing plain-text passwords
* Even if the database is compromised, passwords remain protected

### **jsonwebtoken (JWT)**

Used for authentication.

* Generates tokens after login
* Allows stateless authentication
* Users don’t need to log in repeatedly for every request


## Server & Middleware

### **express**

Core framework used to build the backend APIs.

* Handles routing
* Middleware support
* Clean request/response handling

### **cookie-parser**

Used to parse cookies from incoming requests.

* Helps store and read JWT tokens securely
* Enables session-like behavior using cookies

### **dotenv**

Used to manage environment variables.

* Keeps secrets like API keys and database URLs safe
* Prevents hardcoding sensitive data in code

## Database

### **mongoose**

ODM (Object Data Modeling) library for MongoDB.

* Schema-based structure
* Easy querying and validation
* Helps maintain clean and scalable database logic


## Email Service

### **nodemailer**

* Used to send emails from the application (e.g., verification, notifications).

### How it works with Google (OAuth2)

To securely send emails using Gmail SMTP, I used **Google OAuth2 authentication** instead of simple passwords.

### Steps I followed:

1. Went to **Google Cloud Console**
2. Created a new project
3. Enabled Gmail API
4. Generated:

   * **Client ID**
   * **Client Secret**
5. Configured OAuth consent screen
6. Generated refresh token

---

### Why this is important

* Instead of using your Gmail password ( unsafe ), OAuth2:

  * Provides **secure access tokens**
  * Allows controlled access to Gmail SMTP servers
* Nodemailer uses these credentials to:

  * Authenticate with Google
  * Send emails on behalf of the user securely

---

### Connection to Computer Networks (Semester 5)

This directly relates to concepts studied in **Computer Networks**, such as:

* **SMTP (Simple Mail Transfer Protocol)** → used for sending emails
* **Authentication protocols** → secure communication
* **Client-server architecture**

This project helped bridge theory (CN concepts) with real-world implementation.

This project utilizes the concept of Idempotency-Key
# Idempotency
### What is Idempotency?

Idempotency means:

Performing the same operation multiple times should give the **same result**, not duplicate effects.

## Simple Example

Imagine:
You click **“Pay ₹500”** button...

But your internet is slow, so you panic and click it **3 times** 

Without idempotency:
* ₹500 × 3 = ₹1500 gone 

With idempotency:
* Only ₹500 is charged 

## Why it matters in this project

In transaction systems:

* Network retries
* Double clicks
* Server delays

 Can cause **duplicate transactions**

## How this project prevents it

### Idempotency Key
Each transaction request includes a: idempotency-key

### Flow:

1. Client sends request with unique key
2. Server checks:

   * If key exists → return previous response
   * If not → process transaction and store result


### Security & Reliability

* Prevents duplicate payments
* Ensures consistency in database
* Safe against retries and failures

## Real-world analogy

Think of it like:

* A **movie ticket booking ID**
* Even if you refresh or retry, you don’t get multiple tickets

# Conclusion

This project demonstrates:

* Secure authentication using JWT
* Safe password handling with bcrypt
* Clean API architecture using Express
* Database management with Mongoose
* Real-world email integration via Nodemailer + OAuth2
* Strong system design with idempotency

#  What I Learned

* Implementing real-world backend systems
* Connecting theory (Computer Networks) with practical use
* Writing secure and scalable APIs
* Handling edge cases like duplicate transactions


# Future Improvements

* Add rate limiting
* Improve logging and monitoring
* Add frontend dashboard
* Implement caching (Redis)


