/**
 * Department Constants and Utilities for Team Management
 */

export enum Department {
  TECHNICAL = 'Technical',
  SALES = 'Sales',
  PRODUCT_SUPPORT = 'Product Support',
  QUALITY_ASSURANCE = 'Quality Assurance',
  BILLING = 'Billing',
  OPERATIONS = 'Operations',
  MARKETING = 'Marketing',
  OTHER = 'Other'
}

export const DEPARTMENT_LABELS: Record<Department, string> = {
  [Department.TECHNICAL]: 'Technical Support',
  [Department.SALES]: 'Sales',
  [Department.PRODUCT_SUPPORT]: 'Product Support',
  [Department.QUALITY_ASSURANCE]: 'Quality Assurance',
  [Department.BILLING]: 'Billing & Payments',
  [Department.OPERATIONS]: 'Operations',
  [Department.MARKETING]: 'Marketing',
  [Department.OTHER]: 'Other'
};

export const DEPARTMENT_COLORS: Record<Department, string> = {
  [Department.TECHNICAL]: 'bg-blue-100 text-blue-800 border border-blue-200',
  [Department.SALES]: 'bg-orange-100 text-orange-800 border border-orange-200',
  [Department.PRODUCT_SUPPORT]: 'bg-green-100 text-green-800 border border-green-200',
  [Department.QUALITY_ASSURANCE]: 'bg-purple-100 text-purple-800 border border-purple-200',
  [Department.BILLING]: 'bg-red-100 text-red-800 border border-red-200',
  [Department.OPERATIONS]: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  [Department.MARKETING]: 'bg-pink-100 text-pink-800 border border-pink-200',
  [Department.OTHER]: 'bg-gray-100 text-gray-800 border border-gray-200'
};

/**
 * Get all departments
 */
export function getAllDepartments(): Array<{ value: string; label: string }> {
  return Object.values(Department).map(dept => ({
    value: dept,
    label: DEPARTMENT_LABELS[dept as Department] || dept
  }));
}

/**
 * Get department color class
 */
export function getDepartmentColor(department: string | undefined): string {
  const dept = Object.values(Department).find(d => d === department);
  if (dept) {
    return DEPARTMENT_COLORS[dept];
  }
  return DEPARTMENT_COLORS[Department.OTHER];
}

/**
 * Get department label
 */
export function getDepartmentLabel(department: string | undefined): string {
  const dept = Object.values(Department).find(d => d === department);
  if (dept) {
    return DEPARTMENT_LABELS[dept];
  }
  return department || Department.OTHER;
}

/**
 * Group items by department
 */
export function groupByDepartment<T extends { team?: string; department?: string; departmentBadge?: string }>(
  items: T[]
): Record<string, T[]> {
  const grouped: Record<string, T[]> = {};
  
  items.forEach(item => {
    const dept = item.departmentBadge || item.department || item.team || Department.OTHER;
    if (!grouped[dept]) {
      grouped[dept] = [];
    }
    grouped[dept].push(item);
  });
  
  return grouped;
}

/**
 * Filter items by department
 */
export function filterByDepartment<T extends { team?: string; department?: string; departmentBadge?: string }>(
  items: T[],
  department: string | null | undefined
): T[] {
  if (!department) return items;
  
  return items.filter(item => {
    const itemDept = item.departmentBadge || item.department || item.team;
    return itemDept === department;
  });
}
