# **App Name**: Aurora Metro Induction Planner

## Core Features:

- Dashboard: Display trainset list with status (service, standby, maintenance/cleaning), fitness status, job-card status, mileage, and SLA priority.
- Visualization Panels: Display SLA coverage meter, mileage balance chart, and shunting simulation viewer using graphs.
- Explanability Panel: Provide explanations for train assignments, such as reasons for maintenance or standby status; this is generated using a reasoning tool.
- Overrides & Simulation: Allow controllers to toggle train assignments (service ↔ standby ↔ maintenance) and instantly re-simulate to update metrics.
- Reports & Export: Generate final induction plan and export as PDF/Excel for depot teams; distribute to mobile devices of field staff.
- Monitoring & Alerts: Metrics panel for managers to track trainset availability, SLA misses, and induction plan generation time; alerts via email/SMS.
- Optimized Path Planning: Use a genetic algorithm to find optimal shunting paths and patterns for train induction.

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5), offering a sense of trust and efficiency, inspired by modern transportation design.
- Background color: Light Gray (#F5F5FA), maintaining a clean and uncluttered screen look with minimal saturation (8%).
- Accent color: Slate Blue (#607D8B) to highlight interactive elements.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look, is suitable for headlines or body text
- Use clear, consistent icons to represent train status, job-card status, and other key metrics.
- Center panel with trainset table, right panel with graphs, top bar for notifications, bottom bar for control buttons, and popups for 'Why?' explanations.
- Subtle transitions and animations when toggling train assignments and updating metrics in real-time.