Project Proposal: Decision-Support & Comparison Engine

Tech Stack
-Frontend: React (Vite)
-Backend: Node.js with Express
-Database: MongoDB
-Deployment: Render

Focus of the Project
An evenly focused full-stack application:
-The backend will handle structured scoring logic and data relationships.
-The frontend will focus on an intuitive comparison interface and clear result visualization.

Project Type
-Web application accessible through modern browsers.

Project Goal
-The goal of this project is to help users make complex decisions using a structured evaluation system rather than informal pros-and-cons lists.

Users will be able to:
-Create a decision
-Define evaluation criteria
-Assign weights to criteria
-Add multiple options
-Score each option against the criteria
-View ranked results based on weighted scoring

User Demographic
Examples of users:
-Students comparing academic or career options
-Professionals evaluating job offers
-Individuals making financial or relocation decisions
-Anyone seeking structured support for high-impact choices

Data and API
This project will use a custom-built API.

Data
The application will store:
-Users
-Decisions
-Criteria with weights
-Options
-Scoring inputs
-Optional reflections on outcomes

Data Collection
-No external API needed for core functionality

Project Approach

Database Schema
-The database will include models for users, decisions, criteria, options, and scores. Relationships will allow each decision to contain multiple criteria and options, with weighted scoring logic applied to calculate final rankings.

Potential API Issues
-Maintaining accurate scoring calculations when weights change
-Ensuring numeric validation for scoring inputs
-Preserving relational consistency between decisions and associated data

Sensitive Information
-The application will store user emails and hashed passwords. Authentication and protected routes will be implemented to secure user data.

Core Functionality
-User authentication (register/login/logout)
-Create, edit, and delete decisions
-Add criteria and assign weights
-Add and score multiple options
-Automatic weighted score calculation
-Ranked results display

User Flow

1. User logs in
2. Creates a decision
3. Adds criteria and assigns weights
4. Adds options
5. Scores each option
6. Views ranked comparison results
