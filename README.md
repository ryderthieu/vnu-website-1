# Overview
This project focuses on creating a comprehensive 3D visualization of the
Vietnam National University – Ho Chi Minh City (VNU-HCM) urban area. It
transforms abstract geospatial data into an immersive digital environment, allowing
users to explore the entire campus through detailed 3D models of buildings and
landmarks. Beyond serving as a visualization tool, the system functions as a practical
operational platform, enabling the management board to efficiently monitor, organize,
and manage spatial assets across the campus. By integrating intuitive visuals with
actionable insights, the project enhances both campus navigation and administrative
oversight.

# Feaures
## General System & User Management
- **Authentication & Authorization**: Implements secure login and role-based access control for both users and administrators.
- **User Management**: Administrative tools to manage user accounts, profiles, and permissions.

## Core Functionalities
- **News Feed & Content Management:** Allows users to view latest updates and administrators to manage (create, update, delete) news articles.
- **Incident & Management:** Enables users to view issues and provides a dashboard for administrators to manage and resolve incidents.
- **VNU Campus 3D Visualization:** An interactive 3D map for visualizing the Vietnam National University (VNU) urban area.
- **Point of Interest (POI) & Building Information:** Detailed information and metadata for specific locations and buildings within the campus.
- **Navigation & Wayfinding:** Calculates and displays the optimal route between two selected locations.
- **Building & Location Management:** Administrative tools to manage infrastructure data, including building details and spatial locations.
- **Forum Interaction:** Allows users to create posts and engage through comments or reactions (likes/interactions).
- **Forum Moderation & Management:** Tools for administrators to moderate content, manage categories, and oversee community discussions.

# System Design
- We applied the SUDM (Specialized Urban Data Model) model for the representation of buildings within the area.
<img width="755" height="351" alt="image" src="https://github.com/user-attachments/assets/f816f9be-4cb1-4a89-beae-6f0c644bfd63" />

- Entity Relationship Diagram (ERD):
  <img width="924" height="480" alt="image" src="https://github.com/user-attachments/assets/9c38f161-629c-475c-a354-4769acf2eedd" />

# Techstack
- **Backend**: NestJS
- **Frontend**: ReactJS, TailwindCSS, Arcgis, Three.js
- **Database**: Postgis

