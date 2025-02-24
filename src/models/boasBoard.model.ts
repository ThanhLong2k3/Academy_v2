export interface IStatistics {
  // Personnel Statistics
  total_personnel: number;
  active_personnel: number;
  inactive_personnel: number;

  // Partner Statistics
  total_partners: number;
  active_partners: number;
  inactive_partners: number;

  // Customer Statistics
  total_customers: number;

  // Project Statistics
  total_projects: number;
  active_projects: number;
  completed_projects: number;

  // Product Statistics
  total_products: number;
  available_products: number;
  completed_products: number;

  // Topic Statistics
  total_topics: number;
  active_topics: number;
  completed_topics: number;

  // Training Course Statistics
  total_courses: number;
  active_courses: number;
  completed_courses: number;

  // Intellectual Property Statistics
  total_ip: number;
  granted_ip: number;
  pending_ip: number;
}
