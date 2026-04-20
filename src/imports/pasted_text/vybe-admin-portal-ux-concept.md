Design an Admin Portal for VYBE using the same visual language and premium design style as the existing user-facing platform.

Context:
VYBE is a premium property intelligence and execution platform for HNI clients. The current product uses a clean, minimal, modern command-center style UI with soft cards, subtle colors, spacious layouts, premium typography, and a high-trust wealth-tech aesthetic. The admin portal should feel like part of the same ecosystem, not a separate tool.

Goal:
Create an admin portal that helps internal VYBE teams manage partners, clients, approvals, invitations, and relationship workflows efficiently.

Design Direction:
- Use the same design system as the main VYBE product
- Premium, minimal, high-trust, modern dashboard aesthetic
- Clean sidebar navigation
- Soft card-based layouts
- Muted background tones with VYBE green as the primary accent
- Spacious information hierarchy
- Clear status chips, tags, and action buttons
- Strong focus on operational clarity and enterprise trust
- Avoid cluttered “traditional admin panel” styling

Core Modules:

1. User Management
Purpose: Manage all partner and internal user accounts

User roles to support:
- Legal Partner
- Survey / Technician Partner
- Architect / Planning Partner
- Developer / JV Partner
- Channel / Field Partner
- Documentation / Compliance Partner

Key capabilities:
- View all users in a structured table or card-list layout
- Filter by role, status, region, and activity
- View user profile details
- Activate / deactivate users
- Assign or update role
- Track onboarding status
- View linked cases or assigned work
- Search users quickly

2. Client Management
Purpose: Manage HNI clients across lifecycle stages

Client statuses:
- Waitlist Client
- Active Client
- Deactivated Client

Key capabilities:
- Separate tabs or segmented views for Waitlist, Active, and Deactivated clients
- Search and filter clients
- View client profile summary
- View assigned Relationship Manager (RM)
- View service activity and lifecycle stage
- For Active Clients, admin should be able to open the client profile and view all properties added in the system
- For each property, show property type, location, ownership status, uploaded documents, and requested services

3. Waitlist Approval Workflow
Purpose: Convert approved waitlist users into active clients

Key capabilities:
- View list of waitlist clients awaiting approval
- Open client details before approval
- Review signup details and uploaded information
- Approve or reject waitlist clients
- Assign RM during approval flow
- Add internal notes before activation
- Once approved, client status becomes Active Client
- Show clear audit trail of who approved and when

4. RM Assignment
Purpose: Assign relationship ownership for each client

Key capabilities:
- Assign RM during client approval
- Reassign RM later if needed
- Filter clients by RM
- View RM workload distribution
- Show RM name in client profile and list views

5. Invitation Management
Purpose: Allow admin to invite clients directly into the platform

Key capabilities:
- Admin can create an invite
- Invitation can include name, email, phone, client type, and optional RM pre-assignment
- Invited client can register directly through the invite flow
- Invited clients bypass the waitlist and become Active Clients directly
- Track invitation status:
  - Draft
  - Sent
  - Accepted
  - Expired
- Allow resend and revoke invite actions

Key Screens to Design:
- Admin Dashboard / Command Center
- User Management List
- User Detail View
- Client Management List
- Waitlist Approval Queue
- Active Client Detail View
- Property View inside Client Profile
- Invitation Management
- Create Invite Modal / Page
- RM Assignment flow
- Activity / audit timeline for admin actions

Dashboard Requirements:
The dashboard should provide a quick operational overview with premium executive visibility.

Suggested widgets:
- Total Waitlist Clients
- Total Active Clients
- Pending Approvals
- Invites Sent
- Active Partners by Role
- Recently Added Properties
- Recent Client Activations
- RM Assignment Snapshot

UX Expectations:
- Prioritize clarity and fast admin action
- Make approval and assignment workflows frictionless
- Design for operational scale but with luxury-grade polish
- Use informative empty states
- Use clear confirmation states for approval, activation, invite sent, and deactivation
- Use status badges and timeline components where helpful
- Keep tables clean and modern, not dense
- Each client profile should feel rich, trustworthy, and easy to scan

Tone of Product:
- Premium
- Efficient
- Institutional
- Intelligent
- High-trust
- Calm and modern

Output Expectation:
Create a complete admin portal UX concept with page structure, navigation, component system, and screen-level content that matches the VYBE platform’s design style.